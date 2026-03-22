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

func (s *SessionStore) GetAvatarDir() string {
	return filepath.Join(filepath.Dir(s.filePath), "avatars")
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

func (s *SessionStore) DeleteSession(userID string) error {
	sessions, err := s.LoadSessions()
	if err != nil {
		return err
	}

	updated := []models.LoginSession{}
	for _, sess := range sessions {
		if sess.UserID != userID {
			updated = append(updated, sess)
		}
	}

	return s.SaveSessions(updated)
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

func (s *SessionStore) UpdateAvatarImage(userID string, avatarImage string) error {
	sessions, _ := s.LoadSessions()

	for i := range sessions {
		if sessions[i].UserID == userID {
			sessions[i].AvatarImage = avatarImage
			sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
			return s.SaveSessions(sessions)
		}
	}

	return fmt.Errorf("session not found")
}

func (s *SessionStore) UpdateAvatarColor(userID string, avatarColor string) error {
	sessions, _ := s.LoadSessions()

	for i := range sessions {
		if sessions[i].UserID == userID {
			sessions[i].AvatarColor = avatarColor
			sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
			return s.SaveSessions(sessions)
		}
	}

	return fmt.Errorf("session not found")
}

func (s *SessionStore) addOrUpdate(session models.LoginSession) error {
	sessions, _ := s.LoadSessions()

	found := false
	for i, sItem := range sessions {
		if sItem.UserID == session.UserID {
			// Always refresh the token (sessions expire)
			if session.LoginToken != "" {
				sessions[i].LoginToken = session.LoginToken
			}
			if sItem.Username == "" && session.Username != "" {
				sessions[i].Username = session.Username
			}
			if session.Alias != "" {
				sessions[i].Alias = session.Alias
			}
			sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
			found = true
			break
		}
	}

	if !found {
		session.CreatedAt = time.Now().Format(time.RFC3339)
		session.UpdatedAt = time.Now().Format(time.RFC3339)
		sessions = append(sessions, session)
	}

	return s.SaveSessions(sessions)
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
