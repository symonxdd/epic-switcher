package utils

import (
	"os"
	"path/filepath"
)

// Can be any folder name (can include spaces)
const AppFolderName = "Epic Moka Switcher"

func GetAppDataPath() string {
	localAppData, _ := os.UserCacheDir()
	return filepath.Join(localAppData, AppFolderName)
}

// GetEpicLoginSessionPath returns the path to the Epic Games Launcher session file.
func GetEpicLoginSessionPath() string {
	localAppData := os.Getenv("LOCALAPPDATA")
	if localAppData == "" {
		return ""
	}

	return filepath.Join(localAppData, "EpicGamesLauncher", "Saved", "Config", "Windows", "GameUserSettings.ini")
}

// GetEpicLogsPath returns the path to the Epic Games Launcher log directory
func GetEpicLogsPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Logs")
}
