package services

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

type SessionStore struct {
	filePath string
}

func NewSessionStore() *SessionStore {
	path := filepath.Join(utils.GetAppDataPath(), "login_sessions.json")
	return &SessionStore{filePath: path}
}

// Ensure JSON file exists
func (s *SessionStore) ensureFile() error {
	dir := filepath.Dir(s.filePath)

	// Create the directory if missing
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}

	// Now safely create the file if missing
	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		empty := []models.LoginSession{}
		data, _ := json.MarshalIndent(empty, "", "  ")
		return os.WriteFile(s.filePath, data, 0644)
	}

	return nil
}

func (s *SessionStore) LoadSessions() ([]models.LoginSession, error) {
	s.ensureFile()
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return nil, err
	}
	var sessions []models.LoginSession
	_ = json.Unmarshal(data, &sessions)
	return sessions, nil
}

func (s *SessionStore) SaveSessions(sessions []models.LoginSession) error {
	data, err := json.MarshalIndent(sessions, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

func (s *SessionStore) UpdateAlias(userID string, alias string) error {
	sessions, _ := s.LoadSessions()

	for i := range sessions {
		if sessions[i].UserID == userID {
			sessions[i].Alias = alias
			sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
			return s.SaveSessions(sessions)
		}
	}

	return fmt.Errorf("session not found")
}

func (s *SessionStore) addOrUpdate(session models.LoginSession) error {
	// 1. Load all sessions currently stored in JSON
	sessions, _ := s.LoadSessions()

	found := false
	for i, sItem := range sessions {
		// 2. Check if the same UserID already exists
		if sItem.UserID == session.UserID {

			// 3. Only update fields that were previously empty
			if sItem.Username == "" && session.Username != "" {
				sessions[i].Username = session.Username
			}
			if sItem.LoginToken == "" && session.LoginToken != "" {
				sessions[i].LoginToken = session.LoginToken
			}

			// 4. Update alias if user changed it
			if session.Alias != "" {
				sessions[i].Alias = session.Alias
			}

			// 5. Update timestamp
			sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
			found = true
			break
		}
	}

	// 6. If no existing session found, add it as new
	if !found {
		session.CreatedAt = time.Now().Format(time.RFC3339)
		session.UpdatedAt = time.Now().Format(time.RFC3339)
		sessions = append(sessions, session)
	}

	// 7. Save everything back to JSON
	return s.SaveSessions(sessions)
}
