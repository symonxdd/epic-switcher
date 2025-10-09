package services

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"epic-games-account-switcher/backend/utils"
)

// how many log files to scan by default if not deep searching
const maxRecentLogFiles = 3

// marker string used to find relevant log lines
const epicLaunchMarker = "FCommunityPortalLaunchAppTask: Preparing to launch app"

type LogReaderService struct {
	LogsDir string
}

// constructor
func NewLogReaderService() *LogReaderService {
	return &LogReaderService{LogsDir: utils.GetEpicLogsPath()}
}

// SyncUsernames checks the sessions file and fills in missing usernames
// from Epic Games log files. It does nothing if there's no sessions file,
// no sessions stored, or no missing usernames.
func (l *LogReaderService) SyncUsernames(isDeepSearch bool) (bool, error) {

	// 1. Load sessions from JSON file
	store := NewSessionStore()
	sessions, err := store.LoadSessions()
	if err != nil {
		return false, fmt.Errorf("failed to load sessions: %w", err)
	}

	// 2. If no sessions at all, skip work
	if len(sessions) == 0 {
		fmt.Println("ℹ️ No sessions found, skipping SyncUsernames.")
		return false, nil
	}

	// 3. Check if any session actually has missing usernames
	hasMissing := false
	for _, s := range sessions {
		if s.Username == "" {
			hasMissing = true
			break
		}
	}
	if !hasMissing {
		fmt.Println("ℹ️ No missing usernames in sessions, skipping SyncUsernames.")
		return false, nil
	}

	// 4. Get log file paths
	logFiles, _ := filepath.Glob(filepath.Join(l.LogsDir, "*EpicGamesLauncher*.log"))
	if len(logFiles) == 0 {
		fmt.Println("ℹ️ No log files found.")
		return false, nil
	}

	// 5. Sort log files so newest are first
	sort.Slice(logFiles, func(i, j int) bool {
		fi, _ := os.Stat(logFiles[i])
		fj, _ := os.Stat(logFiles[j])
		return fi.ModTime().After(fj.ModTime())
	})

	// 6. If not deep search, limit to recent few
	if !isDeepSearch && len(logFiles) > maxRecentLogFiles {
		logFiles = logFiles[:maxRecentLogFiles]
	}

	fmt.Printf("🔍 Using %d log file(s) for username sync.\n", len(logFiles))
	fmt.Printf("🔍 Searching in log files: %v\n", logFiles)

	// 7. Prepare regex patterns
	usernamePattern := regexp.MustCompile(`-epicusername="([^"]+)"`)
	userIdPattern := regexp.MustCompile(`-epicuserid=([a-f0-9]+)`)

	// 8. Build userId → username map from logs
	found := map[string]string{}

	for _, path := range logFiles {
		file, err := os.Open(path)
		if err != nil {
			continue
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			if !strings.Contains(line, epicLaunchMarker) {
				continue
			}
			usernameMatch := usernamePattern.FindStringSubmatch(line)
			userIdMatch := userIdPattern.FindStringSubmatch(line)
			if len(usernameMatch) > 1 && len(userIdMatch) > 1 {
				found[userIdMatch[1]] = usernameMatch[1]
			}
		}
	}

	// 9. If no usernames found in logs, stop here
	if len(found) == 0 {
		fmt.Println("ℹ️ No usernames found in logs.")
		return false, nil
	}

	// 10. Fill in missing usernames and mark updated
	changed := false
	for i, s := range sessions {
		if s.Username == "" {
			if uname, ok := found[s.UserID]; ok {
				sessions[i].Username = uname
				sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
				changed = true
			}
		}
	}

	// 11. Save sessions if anything changed
	if changed {
		if err := store.SaveSessions(sessions); err != nil {
			return false, fmt.Errorf("failed to save updated sessions: %w", err)
		}
		fmt.Println("✅ Missing usernames filled from logs.")
		return true, nil
	}

	fmt.Println("ℹ️ No usernames updated.")
	return false, nil
}
