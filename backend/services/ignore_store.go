package services

import (
	"encoding/json"
	"os"
	"path/filepath"

	"epic-games-account-switcher/backend/utils"
)

type IgnoreListStore struct {
	filePath string
}

func NewIgnoreListStore() *IgnoreListStore {
	path := filepath.Join(utils.GetAppDataPath(), "ignored_sessions.json")
	return &IgnoreListStore{filePath: path}
}

func (s *IgnoreListStore) ensureFile() error {
	dir := filepath.Dir(s.filePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}
	}
	if _, err := os.Stat(s.filePath); os.IsNotExist(err) {
		empty := []string{}
		data, _ := json.MarshalIndent(empty, "", "  ")
		return os.WriteFile(s.filePath, data, 0644)
	}
	return nil
}

func (s *IgnoreListStore) Load() ([]string, error) {
	s.ensureFile()
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return nil, err
	}
	var list []string
	_ = json.Unmarshal(data, &list)
	return list, nil
}

func (s *IgnoreListStore) Save(list []string) error {
	data, err := json.MarshalIndent(list, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

func (s *IgnoreListStore) Add(userID string) error {
	list, _ := s.Load()
	for _, id := range list {
		if id == userID {
			return nil // already ignored
		}
	}
	list = append(list, userID)
	return s.Save(list)
}

func (s *IgnoreListStore) IsIgnored(userID string) (bool, error) {
	list, err := s.Load()
	if err != nil {
		return false, err
	}
	for _, id := range list {
		if id == userID {
			return true, nil
		}
	}
	return false, nil
}

// Unignore removes a userID from the ignored_sessions.json list and saves the file.
func (s *IgnoreListStore) Unignore(userID string) error {
	// Ensure file exists before operating
	if err := s.ensureFile(); err != nil {
		return err
	}

	// Load current list
	list, err := s.Load()
	if err != nil {
		return err
	}

	// Build updated list without the target ID
	updated := make([]string, 0, len(list))
	found := false
	for _, id := range list {
		if id == userID {
			found = true
			continue
		}
		updated = append(updated, id)
	}

	// If not found, nothing to do
	if !found {
		return nil
	}

	// Save updated list
	if err := s.Save(updated); err != nil {
		return err
	}

	return nil
}
