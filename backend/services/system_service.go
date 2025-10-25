package services

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"runtime"

	"epic-games-account-switcher/backend/utils"
)

// SystemService provides OS-level helpers (open folders, highlight files, etc.)
type SystemService struct{}

// Constructor
func NewSystemService() *SystemService {
	return &SystemService{}
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
			cmd = exec.Command("explorer", targetPath)
		} else {
			cmd = exec.Command("explorer", "/select,", targetPath)
		}
	case "darwin":
		cmd = exec.Command("open", "-R", targetPath)
	default: // Linux
		cmd = exec.Command("xdg-open", filepath.Dir(targetPath))
	}

	return cmd.Start()
}
