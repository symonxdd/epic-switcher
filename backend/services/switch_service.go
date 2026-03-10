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

const rememberMePrefix = "[RememberMe]\nEnable=True\nData="

type SwitchService struct {
	diag *DiagnosticService
}

func NewSwitchService(diag *DiagnosticService) *SwitchService {
	return &SwitchService{diag: diag}
}

// SwitchAccount replaces the current Epic Games session file with a new one,
// after closing and restarting the launcher.
func (s *SwitchService) SwitchAccount(session models.LoginSession) error {
	fmt.Println("🔹 Closing Epic Games Launcher before switching accounts...")

	// 1️⃣ Kill the Epic Games Launcher
	killCmd := helper.NewCommand("taskkill", "/IM", "EpicGamesLauncher.exe", "/F")
	err := killCmd.Run()
	launcherWasRunning := true
	if err != nil {
		errStr := err.Error()
		if strings.Contains(errStr, "not found") || strings.Contains(errStr, "exit status 128") {
			fmt.Println("ℹ️ Epic Games Launcher was already closed, continuing...")
			launcherWasRunning = false
		} else {
			s.diag.SetLastError(fmt.Sprintf("failed to close Epic Games Launcher: %v", err))
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
				err := fmt.Errorf("timeout waiting for Epic Games Launcher to close")
				s.diag.SetLastError(err.Error())
				return err
			case <-ticker.C:
				checkCmd := helper.NewCommand("tasklist", "/FI", "IMAGENAME eq EpicGamesLauncher.exe")
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
	fmt.Printf("🔹 Preparing to write session to path: '%s'\n", path)
	if path == "" {
		fmt.Println("❌ Error: GetEpicLoginSessionPath returned an empty string. The path could not be resolved.")
		return fmt.Errorf("epic login session path is empty")
	}

	content := fmt.Sprintf("%s%s", rememberMePrefix, session.LoginToken)
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		fmt.Printf("❌ Error writing session file to '%s': %v\n", path, err)
		s.diag.SetLastError(fmt.Sprintf("failed to write session file at %s: %v", path, err))
		return fmt.Errorf("failed to write session file at %s: %w", path, err)
	}
	fmt.Println("✅ New session written successfully to:", path)

	// 4️⃣ Relaunch Epic Games Launcher
	launcherPath := utils.GetEpicLauncherPath()
	fmt.Printf("🔹 Preparing to re-launch Epic Games Launcher from path: '%s'\n", launcherPath)
	if launcherPath == "" {
		fmt.Println("❌ Error: GetEpicLauncherPath returned an empty string.")
		return fmt.Errorf("epic launcher path is empty")
	}

	if _, err := os.Stat(launcherPath); err != nil {
		fmt.Printf("❌ Error: Launcher executable not found or inaccessible at '%s': %v\n", launcherPath, err)
		s.diag.SetLastError(fmt.Sprintf("launcher executable not found at %s: %v", launcherPath, err))
		return fmt.Errorf("launcher executable not found at %s: %w", launcherPath, err)
	}

	startCmd := helper.NewCommand(launcherPath, "-silent")
	startCmd.Stdout = os.Stdout
	startCmd.Stderr = os.Stderr

	fmt.Println("🔹 Executing launch command...")
	if err := startCmd.Start(); err != nil {
		fmt.Printf("❌ Error: Failed to relaunch Epic Games Launcher: %v\n", err)
		s.diag.SetLastError(fmt.Sprintf("failed to relaunch Epic Games Launcher at %s: %v", launcherPath, err))
		return fmt.Errorf("failed to relaunch Epic Games Launcher at %s: %w", launcherPath, err)
	}
	fmt.Println("✅ Epic Games Launcher started successfully.")
	return nil

}
