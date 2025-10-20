package services

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"
	"time"

	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

const rememberMePrefix = "[RememberMe]\nEnable=True\nData="

type SwitchService struct{}

func NewSwitchService() *SwitchService {
	return &SwitchService{}
}

// SwitchAccount replaces the current Epic Games session file with a new one,
// after closing and restarting the launcher.
func (s *SwitchService) SwitchAccount(session models.LoginSession) error {
	fmt.Println("🔹 Closing Epic Games Launcher before switching accounts...")

	// 1️⃣ Kill the Epic Games Launcher
	killCmd := exec.Command("taskkill", "/IM", "EpicGamesLauncher.exe", "/F")
	err := killCmd.Run()
	launcherWasRunning := true
	if err != nil {
		errStr := err.Error()
		if strings.Contains(errStr, "not found") || strings.Contains(errStr, "exit status 128") {
			fmt.Println("ℹ️ Epic Games Launcher was already closed, continuing...")
			launcherWasRunning = false
		} else {
			return fmt.Errorf("failed to close Epic Games Launcher: %w", err)
		}
	} else {
		fmt.Println("✅ Epic Games Launcher closed.")
	}

	// 2️⃣ Only wait for the process to exit if it was running
	if launcherWasRunning {
		startWait := time.Now()
		const maxWait = 8 * time.Second
		const pollInterval = 250 * time.Millisecond
		timeout := time.After(maxWait)
		ticker := time.NewTicker(pollInterval)
		defer ticker.Stop()

	waitLoop:
		for {
			select {
			case <-timeout:
				return fmt.Errorf("timeout waiting for Epic Games Launcher to close")
			case <-ticker.C:
				checkCmd := exec.Command("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
				output, _ := checkCmd.Output()
				if !strings.Contains(string(output), "EpicGamesLauncher.exe") {
					break waitLoop
				}
			}
		}
		elapsed := time.Since(startWait)
		fmt.Printf("✅ Epic Games Launcher process confirmed exited (waited %v)\n", elapsed.Round(time.Millisecond))
	}

	// 3️⃣ Write the new session file
	path := utils.GetEpicLoginSessionPath()
	content := fmt.Sprintf("%s%s", rememberMePrefix, session.LoginToken)
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return fmt.Errorf("failed to write session file: %w", err)
	}
	fmt.Println("✅ New session written to:", path)

	// 4️⃣ Relaunch Epic Games Launcher
	launcherPath := utils.GetEpicLauncherPath()
	fmt.Println("🔹 Re-launching Epic Games Launcher:", launcherPath)

	startCmd := exec.Command(launcherPath)
	startCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	startCmd.Stdout = os.Stdout
	startCmd.Stderr = os.Stderr

	if err := startCmd.Start(); err != nil {
		return fmt.Errorf("failed to relaunch Epic Games Launcher: %w", err)
	}
	fmt.Println("✅ Epic Games Launcher started successfully.")
	return nil
}
