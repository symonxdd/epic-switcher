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

	return filepath.Join(localAppData, "EpicGamesLauncher", "Saved", "Config", "WindowsEditor", "GameUserSettings.ini")
}

// Returns the path to the Epic Games Launcher log directory
func GetEpicLogsPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Logs")
}

// Returns the path to the Epic Games Launcher executable.
// Checks multiple candidate locations since the launcher may be installed
// in either Program Files or Program Files (x86), and in Win64 or Win32.
func GetEpicLauncherPath() string {
	programFiles := os.Getenv("ProgramFiles")
	programFilesX86 := os.Getenv("ProgramFiles(x86)")

	var roots []string
	if programFiles != "" {
		roots = append(roots, programFiles)
	}
	if programFilesX86 != "" && programFilesX86 != programFiles {
		roots = append(roots, programFilesX86)
	}
	if len(roots) == 0 {
		roots = []string{`C:\Program Files`, `C:\Program Files (x86)`}
	}

	binDirs := []string{"Win64", "Win32"}

	for _, root := range roots {
		for _, binDir := range binDirs {
			candidate := filepath.Join(root, "Epic Games", "Launcher", "Portal", "Binaries", binDir, "EpicGamesLauncher.exe")
			if _, err := os.Stat(candidate); err == nil {
				return candidate
			}
		}
	}

	// Fallback: return the most common path even if not found
	return filepath.Join(roots[0], "Epic Games", "Launcher", "Portal", "Binaries", "Win64", "EpicGamesLauncher.exe")
}

// Returns the path to the Epic Games Launcher Data folder.
func GetEpicDataPath() string {
	userDir, _ := os.UserHomeDir()
	return filepath.Join(userDir, "AppData", "Local", "EpicGamesLauncher", "Saved", "Data")
}
