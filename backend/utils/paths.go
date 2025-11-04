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

// Returns the path to the Epic Games Launcher session file.
func GetEpicLoginSessionPath() string {
	localAppData := os.Getenv("LOCALAPPDATA")
	if localAppData == "" {
		return ""
	}

	return filepath.Join(localAppData, "EpicGamesLauncher", "Saved", "Config", "Windows", "GameUserSettings.ini")
}

// Returns the path to the Epic Games Launcher log directory
func GetEpicLogsPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Logs")
}

// Returns the path to the Epic Games Launcher executable.
func GetEpicLauncherPath() string {
	programFiles := os.Getenv("ProgramFiles(x86)")
	if programFiles == "" {
		programFiles = `C:\Program Files (x86)` // fallback for unusual setups
	}
	return filepath.Join(programFiles, "Epic Games", "Launcher", "Portal", "Binaries", "Win32", "EpicGamesLauncher.exe")
}

// Returns the path to the Epic Games Launcher Data folder.
func GetEpicDataPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Data")
}
