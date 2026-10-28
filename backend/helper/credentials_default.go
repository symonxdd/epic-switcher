//go:build !windows

// This file is used for non-windows platforms
// using Go build tag (marking per-OS source files)

package helper

import "errors"

// ErrCredentialNotFound is returned when the credential store has no entry for a target.
var ErrCredentialNotFound = errors.New("credential not found")

var errUnsupported = errors.New("only supported on Windows")

// GenericCredential is a generic entry in Windows Credential Manager.
type GenericCredential struct {
	TargetName  string
	UserName    string
	TargetAlias string
	Comment     string
	Persist     uint32
	Blob        []byte
}

func ReadGenericCredential(target string) (*GenericCredential, error) {
	return nil, ErrCredentialNotFound
}

func WriteGenericCredential(c GenericCredential) error {
	return errUnsupported
}

func DeleteGenericCredential(target string) error {
	return nil
}

func DPAPIProtect(data []byte) ([]byte, error) {
	return nil, errUnsupported
}

func DPAPIUnprotect(data []byte) ([]byte, error) {
	return nil, errUnsupported
}
