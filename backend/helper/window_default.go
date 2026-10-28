//go:build !windows

// This file is used for non-windows platforms
// using Go build tag (marking per-OS source files)

package helper

import "time"

func MinimizeAppWindow(exePath string, timeout time.Duration) bool {
	return false
}
