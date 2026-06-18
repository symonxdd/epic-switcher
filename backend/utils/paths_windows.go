//go:build windows

package utils

import (
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/sys/windows/registry"
)

func getEpicLauncherPathPlatform() string {
	// 1. Try registry HKEY_CLASSES_ROOT (merges HKCU and HKLM Classes)
	if path := getPathFromRegistryKey(registry.CLASSES_ROOT, `com.epicgames.launcher\shell\open\command`); path != "" {
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}

	// 2. Try registry HKEY_LOCAL_MACHINE directly
	if path := getPathFromRegistryKey(registry.LOCAL_MACHINE, `SOFTWARE\Classes\com.epicgames.launcher\shell\open\command`); path != "" {
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}

	// Fallback to default path checks
	programFiles := os.Getenv("ProgramFiles(x86)")
	if programFiles == "" {
		programFiles = `C:\Program Files (x86)`
	}

	// Check Win64 default path
	win64Path := filepath.Join(programFiles, "Epic Games", "Launcher", "Portal", "Binaries", "Win64", "EpicGamesLauncher.exe")
	if _, err := os.Stat(win64Path); err == nil {
		return win64Path
	}

	// Check Win32 default path
	win32Path := filepath.Join(programFiles, "Epic Games", "Launcher", "Portal", "Binaries", "Win32", "EpicGamesLauncher.exe")
	if _, err := os.Stat(win32Path); err == nil {
		return win32Path
	}

	// Final fallback
	return win32Path
}

func getPathFromRegistryKey(root registry.Key, path string) string {
	key, err := registry.OpenKey(root, path, registry.QUERY_VALUE)
	if err != nil {
		return ""
	}
	defer key.Close()

	val, _, err := key.GetStringValue("")
	if err != nil {
		return ""
	}

	return parseExecutablePath(val)
}

func parseExecutablePath(cmd string) string {
	cmd = strings.TrimSpace(cmd)
	if cmd == "" {
		return ""
	}

	if cmd[0] == '"' {
		// Find the closing quote starting from index 1
		end := strings.Index(cmd[1:], "\"")
		if end != -1 {
			// Extract between the quotes
			return cmd[1 : end+1]
		}
	}

	// If no quotes, split by space and take the first token
	parts := strings.Split(cmd, " ")
	return parts[0]
}
