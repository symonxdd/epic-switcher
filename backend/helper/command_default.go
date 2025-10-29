//go:build !windows

// This file is used for non-windows platforms
// using Go build tag (marking per-OS source files)

package helper

import (
	"os/exec"
)

func NewCommand(name string, arg ...string) *Command {
	return exec.Command(name, arg...)
}
