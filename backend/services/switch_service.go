package services

import (
	"fmt"
	"os"
	"strings"
	"time"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

const rememberMeSection = "[RememberMe]"

// auxiliaryLauncherProcesses are helper/child processes spawned by the Epic
// Games Launcher. A forceful taskkill of EpicGamesLauncher.exe leaves these
// orphaned, and the next launcher instance stalls for 1-2 minutes waiting on
// the dead IPC/overlay connections they held before it becomes responsive.
var auxiliaryLauncherProcesses = []string{
	"EpicWebHelper.exe",
	"UnrealCEFSubProcess.exe",
	"EOSOverlayRenderer-Win64-Shipping.exe",
	"EpicOnlineServicesUserHelper.exe",
	"CrashReportClient.exe",
}

type SwitchService struct{}

func NewSwitchService() *SwitchService {
	return &SwitchService{}
}

// SwitchAccount replaces the current Epic Games session file with a new one,
// after closing and restarting the launcher.
func (s *SwitchService) SwitchAccount(session models.LoginSession) error {
	fmt.Println("🔹 Closing Epic Games Launcher before switching accounts...")

	// 1️⃣ Force-kill the launcher. Epic Games Launcher doesn't respond to a
	// graceful taskkill request, so attempting one first only adds dead wait
	// time before falling back to this anyway.
	launcherWasRunning := isProcessRunning("EpicGamesLauncher.exe")
	if launcherWasRunning {
		killCmd := helper.NewCommand("taskkill", "/IM", "EpicGamesLauncher.exe", "/F")
		if err := killCmd.Run(); err != nil {
			errStr := err.Error()
			if !strings.Contains(errStr, "not found") && !strings.Contains(errStr, "exit status 128") {
				return fmt.Errorf("failed to close Epic Games Launcher: %w", err)
			}
		}

		if !waitForProcessExit("EpicGamesLauncher.exe", 8*time.Second) {
			return fmt.Errorf("timeout waiting for Epic Games Launcher to close")
		}
		fmt.Println("✅ Epic Games Launcher closed.")
	} else {
		fmt.Println("ℹ️ Epic Games Launcher was already closed, continuing...")
	}

	// 2️⃣ Clean up any orphaned helper processes left behind by the launcher.
	// taskkill blocks until each process is actually terminated, so no extra
	// wait is needed before the OS has released their handles/sockets.
	killAuxiliaryProcesses()

	// 3️⃣ Merge the new session token into the existing session file instead
	// of overwriting it, so unrelated launcher settings (e.g. Preferences) survive.
	path := utils.GetEpicLoginSessionPath()
	if err := upsertRememberMeSection(path, session.LoginToken); err != nil {
		return fmt.Errorf("failed to write session file: %w", err)
	}
	fmt.Println("✅ New session written to:", path)

	// 4️⃣ Relaunch Epic Games Launcher
	launcherPath := utils.GetEpicLauncherPath()
	fmt.Println("🔹 Re-launching Epic Games Launcher:", launcherPath)

	startCmd := helper.NewCommand(launcherPath, "-silent")
	startCmd.Stdout = os.Stdout
	startCmd.Stderr = os.Stderr

	if err := startCmd.Start(); err != nil {
		return fmt.Errorf("failed to relaunch Epic Games Launcher: %w", err)
	}
	fmt.Println("✅ Epic Games Launcher started successfully.")
	return nil
}

// isProcessRunning reports whether a process with the given image name is currently running.
func isProcessRunning(imageName string) bool {
	checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq "+imageName)
	output, _ := checkCmd.Output()
	return strings.Contains(string(output), imageName)
}

// waitForProcessExit polls until the named process is no longer running, or the timeout elapses.
func waitForProcessExit(imageName string, maxWait time.Duration) bool {
	const pollInterval = 250 * time.Millisecond
	timeout := time.After(maxWait)
	ticker := time.NewTicker(pollInterval)
	defer ticker.Stop()

	for {
		select {
		case <-timeout:
			return !isProcessRunning(imageName)
		case <-ticker.C:
			if !isProcessRunning(imageName) {
				return true
			}
		}
	}
}

// killAuxiliaryProcesses force-kills any leftover launcher helper processes.
func killAuxiliaryProcesses() {
	for _, imageName := range auxiliaryLauncherProcesses {
		if !isProcessRunning(imageName) {
			continue
		}
		killCmd := helper.NewCommand("taskkill", "/IM", imageName, "/F")
		if err := killCmd.Run(); err == nil {
			fmt.Println("✅ Cleaned up leftover process:", imageName)
		}
	}
}

// upsertRememberMeSection writes the [RememberMe] section's Enable/Data keys
// into the ini file at path, replacing that section in place if it already
// exists and leaving every other section untouched. If the file doesn't
// exist yet, a new one is created containing only the [RememberMe] section.
func upsertRememberMeSection(path string, loginToken string) error {
	newline := "\r\n"
	sectionLines := []string{rememberMeSection, "Enable=True", "Data=" + loginToken}

	existing, err := os.ReadFile(path)
	if err != nil {
		if !os.IsNotExist(err) {
			return err
		}
		content := strings.Join(sectionLines, newline) + newline
		return os.WriteFile(path, []byte(content), 0644)
	}

	if strings.Contains(string(existing), "\r\n") {
		newline = "\r\n"
	} else {
		newline = "\n"
	}

	lines := strings.Split(strings.ReplaceAll(string(existing), "\r\n", "\n"), "\n")

	sectionStart := -1
	sectionEnd := -1
	for i, line := range lines {
		if strings.TrimSpace(line) == rememberMeSection {
			sectionStart = i
			sectionEnd = len(lines)
			for j := i + 1; j < len(lines); j++ {
				trimmed := strings.TrimSpace(lines[j])
				if strings.HasPrefix(trimmed, "[") && strings.HasSuffix(trimmed, "]") {
					sectionEnd = j
					break
				}
			}
			break
		}
	}

	var result []string
	if sectionStart == -1 {
		result = append(result, lines...)
		for len(result) > 0 && strings.TrimSpace(result[len(result)-1]) == "" {
			result = result[:len(result)-1]
		}
		result = append(result, "", rememberMeSection, "Enable=True", "Data="+loginToken)
	} else {
		result = append(result, lines[:sectionStart]...)
		result = append(result, sectionLines...)
		result = append(result, lines[sectionEnd:]...)
	}

	content := strings.Join(result, newline)
	return os.WriteFile(path, []byte(content), 0644)
}
