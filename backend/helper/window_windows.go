//go:build windows

// This file is used for windows platforms
// using Go build tag (marking per-OS source files)

package helper

import (
	"path/filepath"
	"strings"
	"sync"
	"time"

	"golang.org/x/sys/windows"
)

var (
	user32                   = windows.NewLazySystemDLL("user32.dll")
	procShowWindow           = user32.NewProc("ShowWindow")
	procIsIconic             = user32.NewProc("IsIconic")
	procGetWindow            = user32.NewProc("GetWindow")
	procGetWindowLongPtrW    = user32.NewProc("GetWindowLongPtrW")
	procGetWindowTextLengthW = user32.NewProc("GetWindowTextLengthW")
)

const (
	swMinimize        = 6
	gwOwner           = 4
	gwlExStyle        = ^uintptr(19) // -20
	wsExToolWindow    = 0x80
	windowPollEvery   = 100 * time.Millisecond
	keepMinimizedTime = 4 * time.Second
)

// Window enumeration goes through one shared callback, since Windows only
// allows a limited number of callbacks per process.
var (
	enumMu       sync.Mutex
	enumExePath  string
	enumFound    windows.HWND
	enumPidCache map[uint32]bool
	enumCallback = windows.NewCallback(enumWindowsProc)
)

// MinimizeAppWindow waits for the visible main window of the program at
// exePath and minimizes it to the taskbar. Programs can restore their window
// once more while starting up, so it keeps the window minimized for a few
// seconds after. Reports whether the window was found.
func MinimizeAppWindow(exePath string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	var minimizedAt time.Time

	for time.Now().Before(deadline) {
		if hwnd := findMainWindow(exePath); hwnd != 0 {
			if r, _, _ := procIsIconic.Call(uintptr(hwnd)); r == 0 {
				procShowWindow.Call(uintptr(hwnd), swMinimize)
				if minimizedAt.IsZero() {
					minimizedAt = time.Now()
				}
			}
			if !minimizedAt.IsZero() && time.Since(minimizedAt) > keepMinimizedTime {
				return true
			}
		}
		time.Sleep(windowPollEvery)
	}

	return !minimizedAt.IsZero()
}

// findMainWindow returns the first visible, top-level, titled window that
// belongs to a process running exePath.
func findMainWindow(exePath string) windows.HWND {
	enumMu.Lock()
	defer enumMu.Unlock()

	enumExePath = filepath.Clean(exePath)
	enumFound = 0
	enumPidCache = map[uint32]bool{}
	_ = windows.EnumWindows(enumCallback, nil)

	return enumFound
}

func enumWindowsProc(hwnd windows.HWND, _ uintptr) uintptr {
	if !windows.IsWindowVisible(hwnd) {
		return 1
	}
	if owner, _, _ := procGetWindow.Call(uintptr(hwnd), gwOwner); owner != 0 {
		return 1
	}
	if exStyle, _, _ := procGetWindowLongPtrW.Call(uintptr(hwnd), gwlExStyle); exStyle&wsExToolWindow != 0 {
		return 1
	}
	if length, _, _ := procGetWindowTextLengthW.Call(uintptr(hwnd)); length == 0 {
		return 1
	}

	var pid uint32
	if _, err := windows.GetWindowThreadProcessId(hwnd, &pid); err != nil || pid == 0 {
		return 1
	}
	matches, seen := enumPidCache[pid]
	if !seen {
		matches = strings.EqualFold(processImagePath(pid), enumExePath)
		enumPidCache[pid] = matches
	}
	if matches {
		enumFound = hwnd
		return 0 // stop enumerating
	}
	return 1
}

func processImagePath(pid uint32) string {
	handle, err := windows.OpenProcess(windows.PROCESS_QUERY_LIMITED_INFORMATION, false, pid)
	if err != nil {
		return ""
	}
	defer windows.CloseHandle(handle)

	buf := make([]uint16, windows.MAX_LONG_PATH)
	size := uint32(len(buf))
	if err := windows.QueryFullProcessImageName(handle, 0, &buf[0], &size); err != nil {
		return ""
	}
	return filepath.Clean(windows.UTF16ToString(buf[:size]))
}
