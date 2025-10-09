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

// SyncCurrentLoginSession checks if someone is logged in,
// extracts token & UserID from Epic's session file, and
// stores/updates it in our SessionStore (login_sessions.json).
func (a *AuthService) SyncCurrentLoginSession() error {
	// 1. Get the path to Epic Games' internal session file
	path := utils.GetEpicLoginSessionPath()
	if path == "" {
		return fmt.Errorf("session file not found")
	}

	// 2. Read the contents of the .ini file
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("cannot read session file: %w", err)
	}
	content := string(data)

	// 3. Extract login token (the part after "Data=")
	re := regexp.MustCompile(`Data=([^\r\n]+)`)
	match := re.FindStringSubmatch(content)
	if len(match) < 2 {
		return fmt.Errorf("no token found")
	}
	loginToken := strings.TrimSpace(match[1])

	// 4. If token length is too short, likely not logged in
	if len(loginToken) < 1000 {
		return fmt.Errorf("no valid login token found (user likely logged out)")
	}

	// 5. Extract UserID from section header like [<UserID>_General]
	reID := regexp.MustCompile(`\[(.+?)_General\]`)
	matchID := reID.FindStringSubmatch(content)
	var userID string
	if len(matchID) >= 2 {
		userID = strings.TrimSpace(matchID[1])
	}

	if userID == "" {
		return fmt.Errorf("could not extract user ID")
	}

	// 6. Create a LoginSession object (other fields can be empty initially)
	session := models.LoginSession{
		UserID:     userID,
		LoginToken: loginToken,
	}

	// 7. Add or update session in JSON store
	store := NewSessionStore()
	if err := store.addOrUpdate(session); err != nil {
		return fmt.Errorf("failed to persist session: %w", err)
	}

	// 8. Success!
	fmt.Println("✅ Current Epic login session synced:", userID)
	return nil
}
