package services

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/utils"
)

type DiagnosticService struct {
	lastError string
}

func NewDiagnosticService() *DiagnosticService {
	return &DiagnosticService{}
}

func (s *DiagnosticService) SetLastError(err string) {
	s.lastError = err
}

type DiagnosticData struct {
	OS                             string `json:"os"`
	Architecture                   string `json:"architecture"`
	LocalAppData                   string `json:"localAppData"`
	ProgramFilesx86                string `json:"programFilesX86"`
	EpicLauncherExe                string `json:"epicLauncherExe"`
	EpicLauncherExists             bool   `json:"epicLauncherExists"`
	SessionFileWindows             string `json:"sessionFileWindows"`
	SessionFileWindowsExists       bool   `json:"sessionFileWindowsExists"`
	SessionFileWindowsEditor       string `json:"sessionFileWindowsEditor"`
	SessionFileWindowsEditorExists bool   `json:"sessionFileWindowsEditorExists"`
	EpicGamesRunning               bool   `json:"epicGamesRunning"`
	EpicDataDir                    string `json:"epicDataDir"`
	EpicDataDirExists              bool   `json:"epicDataDirExists"`
	LastError                      string `json:"lastError"`
}

func (s *DiagnosticService) GetDiagnostics() DiagnosticData {
	localAppData := os.Getenv("LOCALAPPDATA")
	programFiles := os.Getenv("ProgramFiles(x86)")

	launcherPath := utils.GetEpicLauncherPath()
	_, errLauncher := os.Stat(launcherPath)
	launcherExists := !os.IsNotExist(errLauncher)

	sessionEditorPath := utils.GetEpicLoginSessionPath()
	_, errSessionEditor := os.Stat(sessionEditorPath)
	sessionEditorExists := !os.IsNotExist(errSessionEditor)

	sessionWindowsPath := filepath.Join(localAppData, "EpicGamesLauncher", "Saved", "Config", "Windows", "GameUserSettings.ini")
	_, errSessionWindows := os.Stat(sessionWindowsPath)
	sessionWindowsExists := !os.IsNotExist(errSessionWindows)

	dataDirPath := utils.GetEpicDataPath()
	_, errDataDir := os.Stat(dataDirPath)
	dataDirExists := !os.IsNotExist(errDataDir)

	running := false
	if runtime.GOOS == "windows" {
		checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
		output, err := checkCmd.Output()
		if err == nil && strings.Contains(string(output), "EpicGamesLauncher.exe") {
			running = true
		}
	}

	return DiagnosticData{
		OS:                             runtime.GOOS,
		Architecture:                   runtime.GOARCH,
		LocalAppData:                   localAppData,
		ProgramFilesx86:                programFiles,
		EpicLauncherExe:                launcherPath,
		EpicLauncherExists:             launcherExists,
		SessionFileWindows:             sessionWindowsPath,
		SessionFileWindowsExists:       sessionWindowsExists,
		SessionFileWindowsEditor:       sessionEditorPath,
		SessionFileWindowsEditorExists: sessionEditorExists,
		EpicGamesRunning:               running,
		EpicDataDir:                    dataDirPath,
		EpicDataDirExists:              dataDirExists,
		LastError:                      s.lastError,
	}
}
