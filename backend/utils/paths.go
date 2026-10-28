package utils

import (
	"os"
	"path/filepath"
	"strings"
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

	return filepath.Join(localAppData, "EpicGamesLauncher", "Saved", "Config", "WindowsEditor", "GameUserSettings.ini")
}

// Returns the path to the Epic Games Launcher log directory
func GetEpicLogsPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Logs")
}

// Returns the path to the Epic Games Launcher executable.
func GetEpicLauncherPath() string {
	return getEpicLauncherPathPlatform()
}

// IsNewLauncher reports whether the installed Epic Games Launcher is the new
// one (in preview since October 2026). The legacy launcher's executable lives
// under ...\Launcher\Portal\Binaries, the new one directly in ...\Launcher.
func IsNewLauncher() bool {
	launcherPath := strings.ToLower(filepath.ToSlash(GetEpicLauncherPath()))
	return !strings.Contains(launcherPath, "/portal/binaries/")
}

// Returns the path to the new Epic Games Launcher's auth folder.
func GetNewLauncherAuthPath() string {
	localAppData := os.Getenv("LOCALAPPDATA")
	if localAppData == "" {
		return ""
	}

	return filepath.Join(localAppData, "com.epicgames.eglv2", "auth")
}

// Returns the path to the Epic Games Launcher Data folder.
func GetEpicDataPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Data")
}
