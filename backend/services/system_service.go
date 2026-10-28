package services

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/utils"
)

// SystemService provides OS-level helpers (open folders, highlight files, etc.)
type SystemService struct{}

// Constructor
func NewSystemService() *SystemService {
	return &SystemService{}
}

// IsNewLauncher reports whether the installed Epic Games Launcher is the new one.
func (s *SystemService) IsNewLauncher() bool {
	return utils.IsNewLauncher()
}

// GetLauncherKind returns "new", "legacy" or "missing" for the installed Epic Games Launcher.
func (s *SystemService) GetLauncherKind() string {
	if _, err := os.Stat(utils.GetEpicLauncherPath()); err != nil {
		return "missing"
	}
	if utils.IsNewLauncher() {
		return "new"
	}
	return "legacy"
}

// Opens a known folder or highlights a file in Explorer/Finder.
func (s *SystemService) OpenDirectory(name string) error {
	var targetPath string

	switch name {
	case "appData":
		targetPath = utils.GetAppDataPath()
	case "sessionFile":
		targetPath = utils.GetEpicLoginSessionPath()
	case "logs":
		targetPath = utils.GetEpicLogsPath()
	case "launcher":
		targetPath = utils.GetEpicLauncherPath()
	default:
		return fmt.Errorf("unknown directory key: %s", name)
	}

	if targetPath == "" {
		return fmt.Errorf("path not found for key: %s", name)
	}

	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		// If it's a file, highlight it. Otherwise open the folder.
		if filepath.Ext(targetPath) == "" {
			cmd = helper.NewCommand("explorer", targetPath)
		} else {
			cmd = helper.NewCommand("explorer", "/select,", targetPath)
		}
	case "darwin":
		cmd = helper.NewCommand("open", "-R", targetPath)
	}

	return cmd.Start()
}
