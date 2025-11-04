package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type UpdateService struct{}

func NewUpdateService() *UpdateService {
	return &UpdateService{}
}

// DTO returned to frontend
type GitHubRelease struct {
	TagName string `json:"tag_name"`
	HTMLURL string `json:"html_url"`
}

// Caching globals (package-level)
var cachedRelease *GitHubRelease
var lastFetch time.Time

// Public Method
func (u *UpdateService) GetLatestVersion() (*GitHubRelease, error) {
	// Cache for 10 minutes
	if cachedRelease != nil && time.Since(lastFetch) < 10*time.Minute {
		return cachedRelease, nil
	}

	const repoAPI = "https://api.github.com/repos/symonxdd/epic-switcher/releases/latest"
	resp, err := http.Get(repoAPI)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch from GitHub: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API returned %d", resp.StatusCode)
	}

	var release GitHubRelease
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return nil, fmt.Errorf("invalid response: %w", err)
	}

	cachedRelease = &release
	lastFetch = time.Now()
	return &release, nil
}
