//go:build windows

// This file is used for windows platforms
// using Go build tag (marking per-OS source files)

package helper

import (
	"os/exec"
	"syscall"
)

func NewCommand(name string, arg ...string) *exec.Cmd {
	cmd := exec.Command(name, arg...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow: true,
	}
	return cmd
}
