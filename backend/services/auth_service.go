package services

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

// AuthService handles login/session related operations.
type AuthService struct{}

// Constructor
func NewAuthService() *AuthService {
	return &AuthService{}
}

// GetCurrentLoginSession reads Epic's session file and returns
// the active session if someone is logged in, otherwise nil.
func (a *AuthService) GetCurrentLoginSession() (*models.LoginSession, error) {
	path := utils.GetEpicLoginSessionPath()
	if path == "" {
		return nil, fmt.Errorf("session (.ini) file not found")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("cannot read session file: %w", err)
	}
	content := string(data)

	re := regexp.MustCompile(`Data=([^\r\n]+)`)
	match := re.FindStringSubmatch(content)
	if len(match) < 2 {
		return nil, fmt.Errorf("no token found")
	}
	loginToken := strings.TrimSpace(match[1])
	if len(loginToken) < 1000 {
		return nil, fmt.Errorf("no valid login token found (user likely logged out)")
	}

	userID, err := getCurrentUserIDFromDataFolder()
	if err != nil {
		return nil, fmt.Errorf("failed to get user ID from Data folder: %w", err)
	}

	return &models.LoginSession{
		UserID:     userID,
		LoginToken: loginToken,
	}, nil
}

// DetectNewLoginSession checks if the current login session is new or not.
func (a *AuthService) DetectNewLoginSession() (*models.LoginSession, error) {
	session, err := a.GetCurrentLoginSession()
	if err != nil || session == nil {
		return nil, err // means no user is logged in or invalid token
	}

	// --- Check against stored sessions ---
	store := NewSessionStore()
	sessions, _ := store.LoadSessions()
	for _, s := range sessions {
		if s.UserID == session.UserID {
			// Already known → no need to prompt
			return nil, nil
		}
	}

	// Return new session
	return session, nil
}

func (a *AuthService) CheckIfSessionIsNew(userID string) (bool, error) {
	store := NewSessionStore()
	sessions, _ := store.LoadSessions()
	for _, s := range sessions {
		if s.UserID == userID {
			return false, nil // already known
		}
	}

	return true, nil
}

func (a *AuthService) AddDetectedSession(session models.LoginSession) error {
	store := NewSessionStore()
	if err := store.addOrUpdate(session); err != nil {
		return fmt.Errorf("failed to persist session: %w", err)
	}
	fmt.Println("✅ User accepted and session added:", session.UserID)
	return nil
}

// MoveAsideActiveSession stops the Epic Games Launcher, clears its login session,
// and re-launches it for the user to sign in again.
func (a *AuthService) MoveAsideActiveSession() error {
	fmt.Println("Stopping Epic Games Launcher...")

	// 1️⃣ Kill the Epic Games Launcher process
	killCmd := helper.NewCommand("taskkill", "/IM", "EpicGamesLauncher.exe", "/F")

	// CombinedOutput runs the command and returns both standard output and standard error.
	// This is crucial because taskkill writes specific messages to stderr/stdout depending on the outcome.
	output, err := killCmd.CombinedOutput()

	if err != nil {
		// If err is not nil, the command exited with a non-zero status (failed).
		// However, a failure can happen simply because the process wasn't running to begin with.
		outputStr := string(output)

		if strings.Contains(strings.ToLower(outputStr), "not found") {
			// Process not running, which is fine.
		} else {
			fmt.Printf("Error closing Epic Games Launcher: %v\nOutput: %s\n", err, outputStr)
			return fmt.Errorf("failed to close Epic Games Launcher: %w", err)
		}
	} else {
		fmt.Println("Epic Games Launcher closed.")
	}

	// 2️⃣ Confirm process is actually gone (poll until no longer found)
	const maxWait = 8 * time.Second
	start := time.Now()

	for {
		checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
		output, _ := checkCmd.Output()
		if !strings.Contains(string(output), "EpicGamesLauncher.exe") {
			break // fully stopped
		}
		if time.Since(start) > maxWait {
			fmt.Println("Timeout waiting for Epic Games Launcher to close.")
			return fmt.Errorf("timeout waiting for Epic Games Launcher to close")
		}
		time.Sleep(250 * time.Millisecond)
	}

	fmt.Println("Confirmed Epic Games Launcher process has exited")

	// 3️⃣ Clear the contents of the login session file
	iniPath := utils.GetEpicLoginSessionPath()
	if iniPath == "" {
		fmt.Println("Error: Could not find Epic Games session path.")
		return fmt.Errorf("could not find Epic Games session path")
	}

	// Check if file exists and is writable
	if _, err := os.Stat(iniPath); err != nil {
		fmt.Printf("Error accessing session file: %v\n", err)
		return fmt.Errorf("cannot access session file: %w", err)
	}

	if err := os.WriteFile(iniPath, []byte(""), 0644); err != nil {
		fmt.Printf("Error clearing session file: %v\n", err)
		return fmt.Errorf("failed to clear session file: %w", err)
	}

	// 4️⃣ Re-launch the Epic Games Launcher
	fmt.Println("Re-launching Epic Games Launcher...")
	launcherPath := utils.GetEpicLauncherPath()

	// Check if launcher executable exists
	if _, err := os.Stat(launcherPath); err != nil {
		fmt.Printf("Error: Launcher executable not found at %s\n", launcherPath)
		return fmt.Errorf("launcher executable not found at %s: %w", launcherPath, err)
	}

	startCmd := helper.NewCommand(launcherPath)

	if err := startCmd.Start(); err != nil {
		fmt.Printf("Error launching Epic Games Launcher: %v\n", err)
		return fmt.Errorf("failed to launch Epic Games Launcher: %w", err)
	}

	fmt.Println("Epic Games Launcher started.")
	return nil
}

// Compares the current session token with the stored one,
// and updates it in login_sessions.json if it's different.
func (a *AuthService) CheckAndRenewLoginToken() (bool, error) {
	session, err := a.GetCurrentLoginSession()
	if err != nil || session == nil {
		return false, err
	}

	store := NewSessionStore()
	sessions, _ := store.LoadSessions()

	for i, s := range sessions {
		if s.UserID == session.UserID {
			// same user found
			if s.LoginToken != session.LoginToken {
				// token changed → update it
				sessions[i].LoginToken = session.LoginToken
				sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)

				if err := store.SaveSessions(sessions); err != nil {
					return false, fmt.Errorf("failed to update session token: %w", err)
				}

				fmt.Println("🔄 Login token renewed for:", session.UserID)
				return true, nil
			}
			return false, nil // token same → nothing to do
		}
	}

	return false, nil // not stored, so nothing to renew
}

// Finds the most recent file inside Epic's Data folder
// and extracts the filename (without extension). If it starts with "OC_", that prefix is removed.
func getCurrentUserIDFromDataFolder() (string, error) {
	dataPath := utils.GetEpicDataPath()
	if dataPath == "" {
		return "", fmt.Errorf("could not resolve Epic Data path")
	}

	entries, err := os.ReadDir(dataPath)
	if err != nil {
		return "", fmt.Errorf("cannot read Epic Data folder: %w", err)
	}

	var latestFile os.DirEntry
	var latestModTime time.Time

	for _, entry := range entries {
		if entry.IsDir() {
			continue // skip directories
		}

		info, err := entry.Info()
		if err != nil {
			continue
		}
		if info.ModTime().After(latestModTime) {
			latestFile = entry
			latestModTime = info.ModTime()
		}
	}

	if latestFile == nil {
		return "", fmt.Errorf("no files found in Epic Data folder")
	}

	filename := latestFile.Name()
	ext := filepath.Ext(filename)
	nameOnly := strings.TrimSuffix(filename, ext)

	nameOnly = strings.TrimPrefix(nameOnly, "OC_")

	if nameOnly == "" {
		return "", fmt.Errorf("could not extract user ID from file: %s", filename)
	}

	return nameOnly, nil
}
