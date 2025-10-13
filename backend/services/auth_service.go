package services

import (
	"fmt"
	"os"
	"regexp"
	"strings"

	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

// AuthService handles login/session related operations.
type AuthService struct{}

// Constructor
func NewAuthService() *AuthService {
	return &AuthService{}
}

// AuthService.go

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

	reID := regexp.MustCompile(`\[(.+?)_General\]`)
	matchID := reID.FindStringSubmatch(content)
	if len(matchID) < 2 {
		return nil, fmt.Errorf("could not extract user ID")
	}
	userID := strings.TrimSpace(matchID[1])

	return &models.LoginSession{
		UserID:     userID,
		LoginToken: loginToken,
	}, nil
}

// DetectNewLoginSession checks if the current login session is new or ignored.
func (a *AuthService) DetectNewLoginSession() (*models.LoginSession, error) {
	session, err := a.GetCurrentLoginSession()
	if err != nil || session == nil {
		return nil, err // means no user is logged in or invalid token
	}

	// --- Check ignored list early ---
	ignoreStore := NewIgnoreListStore()
	ignored, _ := ignoreStore.IsIgnored(session.UserID)
	if ignored {
		fmt.Println("ℹ️ User is in ignore list, skipping prompt.")
		return nil, nil
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
	ignoreStore := NewIgnoreListStore()
	ignored, _ := ignoreStore.IsIgnored(userID)
	if ignored {
		return false, nil
	}

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

func (a *AuthService) IgnoreDetectedSession(userID string) error {
	ignoreStore := NewIgnoreListStore()
	return ignoreStore.Add(userID)
}
