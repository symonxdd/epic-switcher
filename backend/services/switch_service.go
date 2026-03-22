package services

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

type SwitchService struct{}

func NewSwitchService() *SwitchService {
	return &SwitchService{}
}

// SwitchAccount backs up the current session, restores the target account's
// ini file and registry AccountId, clears Epic caches, and relaunches the launcher.
func (s *SwitchService) SwitchAccount(session models.LoginSession) error {
	fmt.Println("Closing Epic Games Launcher...")

	// Kill the Epic Games Launcher
	killCmd := helper.NewCommand("taskkill", "/IM", "EpicGamesLauncher.exe", "/F")
	killOutput, err := killCmd.CombinedOutput()
	launcherWasRunning := true
	if err != nil {
		combined := string(killOutput) + " " + err.Error()
		if strings.Contains(combined, "not found") || strings.Contains(combined, "exit status 128") || strings.Contains(combined, "exit status 1") {
			fmt.Println("Epic Games Launcher was not running, continuing...")
			launcherWasRunning = false
		} else {
			return fmt.Errorf("failed to close Epic Games Launcher: %s", strings.TrimSpace(string(killOutput)))
		}
	} else {
		fmt.Println("Epic Games Launcher closed.")
	}

	// Wait for the process to fully exit
	if launcherWasRunning {
		startWait := time.Now()
		const maxWait = 8 * time.Second
		const pollInterval = 250 * time.Millisecond
		timeout := time.After(maxWait)
		ticker := time.NewTicker(pollInterval)
		defer ticker.Stop()

	waitLoop:
		for {
			select {
			case <-timeout:
				return fmt.Errorf("timeout waiting for Epic Games Launcher to close")
			case <-ticker.C:
				checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
				output, _ := checkCmd.Output()
				if !strings.Contains(string(output), "EpicGamesLauncher.exe") {
					break waitLoop
				}
			}
		}
		elapsed := time.Since(startWait)
		fmt.Printf("Epic Games Launcher exited (waited %v)\n", elapsed.Round(time.Millisecond))
	}

	// Save current account's ini file so we can switch back later
	iniPath := utils.GetEpicLoginSessionPath()
	currentAccountID := readRegistryAccountID()
	if currentAccountID != "" && currentAccountID != session.UserID {
		backupPath := getIniBackupPath(currentAccountID)
		if data, err := os.ReadFile(iniPath); err == nil {
			os.MkdirAll(filepath.Dir(backupPath), 0755)
			os.WriteFile(backupPath, data, 0644)
			fmt.Println("Saved current account ini to:", backupPath)
		}
	}

	// Restore the target account's saved ini, or fall back to token replacement
	targetBackup := getIniBackupPath(session.UserID)
	if data, err := os.ReadFile(targetBackup); err == nil {
		// We have a saved full ini for this account — restore it
		if err := os.WriteFile(iniPath, data, 0644); err != nil {
			return fmt.Errorf("failed to restore session file: %w", err)
		}
		fmt.Println("Restored saved ini from:", targetBackup)
	} else {
		if err := updateTokenInIni(iniPath, session.LoginToken); err != nil {
			return fmt.Errorf("failed to update session file: %w", err)
		}
		fmt.Println("Updated token in:", iniPath)
	}

	// Update the registry AccountId to match the target account
	if err := writeRegistryAccountID(session.UserID); err != nil {
		fmt.Printf("Warning: failed to update registry AccountId: %v\n", err)
	} else {
		fmt.Println("Registry AccountId set to:", session.UserID)
	}

	clearEpicCaches()

	// Relaunch Epic Games Launcher
	launcherPath := utils.GetEpicLauncherPath()
	fmt.Println("Re-launching Epic Games Launcher:", launcherPath)

	startCmd := helper.NewCommand("cmd", "/C", "start", "", launcherPath)

	if err := startCmd.Start(); err != nil {
		return fmt.Errorf("failed to relaunch Epic Games Launcher: %w", err)
	}
	fmt.Println("Epic Games Launcher started.")
	return nil
}

// getIniBackupPath returns the path where a full ini backup is stored per account.
func getIniBackupPath(userID string) string {
	return filepath.Join(utils.GetAppDataPath(), "ini_backups", userID+".ini")
}

// readRegistryAccountID reads the current Epic AccountId from the Windows registry.
func readRegistryAccountID() string {
	cmd := helper.NewCommand("reg", "query", `HKCU\Software\Epic Games\Unreal Engine\Identifiers`, "/v", "AccountId")
	output, err := cmd.Output()
	if err != nil {
		return ""
	}
	// Parse "AccountId    REG_SZ    <value>"
	for _, line := range strings.Split(string(output), "\n") {
		line = strings.TrimSpace(line)
		if strings.Contains(line, "AccountId") {
			parts := strings.Fields(line)
			if len(parts) >= 3 {
				return parts[len(parts)-1]
			}
		}
	}
	return ""
}

// writeRegistryAccountID sets the Epic AccountId in the Windows registry.
func writeRegistryAccountID(accountID string) error {
	cmd := helper.NewCommand("reg", "add", `HKCU\Software\Epic Games\Unreal Engine\Identifiers`, "/v", "AccountId", "/t", "REG_SZ", "/d", accountID, "/f")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("%s: %w", strings.TrimSpace(string(output)), err)
	}
	return nil
}

// clearEpicCaches removes Epic's cached session/overlay data.
func clearEpicCaches() {
	cachePaths := []string{
		filepath.Join(os.Getenv("LOCALAPPDATA"), "Epic Games", "Epic Online Services", "UI Helper", "Cache", "Cache"),
		filepath.Join(os.Getenv("LOCALAPPDATA"), "Epic Games", "Epic Online Services", "UI Helper", "Cache", "GPUCache"),
		filepath.Join(os.Getenv("LOCALAPPDATA"), "Epic Games", "EOSOverlay", "BrowserCache", "Cache"),
	}
	for _, p := range cachePaths {
		if _, err := os.Stat(p); err == nil {
			os.RemoveAll(p)
			fmt.Println("Cleared cache:", p)
		}
	}
}

// updateTokenInIni updates the Data= line in the [RememberMe] section of the ini file.
func updateTokenInIni(iniPath string, token string) error {
	existing, err := os.ReadFile(iniPath)
	if err != nil {
		// File doesn't exist — write a fresh one
		content := ";METADATA=(Diff=true, UseCommands=true)\r\n[RememberMe]\r\nEnable=True\r\nData=" + token + "\r\n"
		return os.WriteFile(iniPath, []byte(content), 0644)
	}

	fileContent := string(existing)
	lines := strings.Split(fileContent, "\n")
	inRememberMe := false
	found := false
	for i, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "[RememberMe]" {
			inRememberMe = true
			continue
		}
		if strings.HasPrefix(trimmed, "[") && trimmed != "[RememberMe]" {
			inRememberMe = false
			continue
		}
		if inRememberMe && strings.HasPrefix(trimmed, "Data=") {
			lines[i] = "Data=" + token
			found = true
			break
		}
	}

	if !found {
		// Insert Data= after Enable=True
		for i, line := range lines {
			if strings.TrimSpace(line) == "Enable=True" {
				lines = append(lines[:i+1], append([]string{"Data=" + token}, lines[i+1:]...)...)
				break
			}
		}
	}

	return os.WriteFile(iniPath, []byte(strings.Join(lines, "\n")), 0644)
}
