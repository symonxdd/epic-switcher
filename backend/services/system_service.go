package services

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"epic-games-account-switcher/backend/helper"
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
			cmd = helper.NewCommand("explorer", targetPath)
		} else {
			cmd = helper.NewCommand("explorer", "/select,", targetPath)
		}
	case "darwin":
		cmd = helper.NewCommand("open", "-R", targetPath)
	}

	return cmd.Start()
}

type DiagnosticInfo struct {
	OS                string `json:"os"`
	Arch              string `json:"architecture"`
	LocalAppData      string `json:"localAppData"`
	ProgramFiles      string `json:"programFiles"`
	ProgramFilesX86   string `json:"programFilesX86"`
	LauncherExe       string `json:"epicLauncherExe"`
	LauncherExists    bool   `json:"epicLauncherExists"`
	SessionFile       string `json:"sessionFile"`
	SessionFileExists bool   `json:"sessionFileExists"`
	EpicDataDir       string `json:"epicDataDir"`
	EpicDataDirExists bool   `json:"epicDataDirExists"`
	EpicLogsDir       string `json:"epicLogsDir"`
	EpicLogsDirExists bool   `json:"epicLogsDirExists"`
	EpicRunning       bool   `json:"epicGamesRunning"`
	LastError         string `json:"lastError,omitempty"`
}

func (s *SystemService) GetDiagnostics() DiagnosticInfo {
	info := DiagnosticInfo{
		OS:              runtime.GOOS,
		Arch:            runtime.GOARCH,
		LocalAppData:    os.Getenv("LOCALAPPDATA"),
		ProgramFiles:    os.Getenv("ProgramFiles"),
		ProgramFilesX86: os.Getenv("ProgramFiles(x86)"),
	}

	info.LauncherExe = utils.GetEpicLauncherPath()
	if _, err := os.Stat(info.LauncherExe); err == nil {
		info.LauncherExists = true
	} else {
		info.LastError = fmt.Sprintf("launcher executable not found at %s: %v", info.LauncherExe, err)
	}

	info.SessionFile = utils.GetEpicLoginSessionPath()
	if _, err := os.Stat(info.SessionFile); err == nil {
		info.SessionFileExists = true
	}

	info.EpicDataDir = utils.GetEpicDataPath()
	if _, err := os.Stat(info.EpicDataDir); err == nil {
		info.EpicDataDirExists = true
	}

	info.EpicLogsDir = utils.GetEpicLogsPath()
	if _, err := os.Stat(info.EpicLogsDir); err == nil {
		info.EpicLogsDirExists = true
	}

	checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
	output, _ := checkCmd.Output()
	info.EpicRunning = strings.Contains(string(output), "EpicGamesLauncher.exe")

	return info
}
