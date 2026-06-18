//go:build !windows

package utils

import (
	"os"
	"path/filepath"
)

func getEpicLauncherPathPlatform() string {
	// Non-Windows fallback (maintaining original behavior)
	programFiles := os.Getenv("ProgramFiles(x86)")
	if programFiles == "" {
		programFiles = `C:\Program Files (x86)`
	}
	return filepath.Join(programFiles, "Epic Games", "Launcher", "Portal", "Binaries", "Win32", "EpicGamesLauncher.exe")
}
