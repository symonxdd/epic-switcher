//go:build windows

// This file is used for windows platforms
// using Go build tag (marking per-OS source files)

package helper

import (
	"errors"
	"unsafe"

	"golang.org/x/sys/windows"
)

// ErrCredentialNotFound is returned when Windows Credential Manager has no entry for a target.
var ErrCredentialNotFound = errors.New("credential not found")

// GenericCredential is a generic entry in Windows Credential Manager.
type GenericCredential struct {
	TargetName  string
	UserName    string
	TargetAlias string
	Comment     string
	Persist     uint32
	Blob        []byte
}

const credTypeGeneric = 1

// credentialW mirrors the Win32 CREDENTIALW struct.
type credentialW struct {
	Flags              uint32
	Type               uint32
	TargetName         *uint16
	Comment            *uint16
	LastWritten        windows.Filetime
	CredentialBlobSize uint32
	CredentialBlob     *byte
	Persist            uint32
	AttributeCount     uint32
	Attributes         uintptr
	TargetAlias        *uint16
	UserName           *uint16
}

var (
	advapi32        = windows.NewLazySystemDLL("advapi32.dll")
	procCredReadW   = advapi32.NewProc("CredReadW")
	procCredWriteW  = advapi32.NewProc("CredWriteW")
	procCredDeleteW = advapi32.NewProc("CredDeleteW")
	procCredFree    = advapi32.NewProc("CredFree")
)

// ReadGenericCredential reads a generic credential from Windows Credential Manager.
func ReadGenericCredential(target string) (*GenericCredential, error) {
	targetPtr, err := windows.UTF16PtrFromString(target)
	if err != nil {
		return nil, err
	}

	var cred *credentialW
	r1, _, callErr := procCredReadW.Call(
		uintptr(unsafe.Pointer(targetPtr)),
		credTypeGeneric,
		0,
		uintptr(unsafe.Pointer(&cred)),
	)
	if r1 == 0 {
		if errors.Is(callErr, windows.ERROR_NOT_FOUND) {
			return nil, ErrCredentialNotFound
		}
		return nil, callErr
	}
	defer procCredFree.Call(uintptr(unsafe.Pointer(cred)))

	blob := make([]byte, cred.CredentialBlobSize)
	if cred.CredentialBlobSize > 0 {
		copy(blob, unsafe.Slice(cred.CredentialBlob, cred.CredentialBlobSize))
	}

	return &GenericCredential{
		TargetName:  windows.UTF16PtrToString(cred.TargetName),
		UserName:    windows.UTF16PtrToString(cred.UserName),
		TargetAlias: windows.UTF16PtrToString(cred.TargetAlias),
		Comment:     windows.UTF16PtrToString(cred.Comment),
		Persist:     cred.Persist,
		Blob:        blob,
	}, nil
}

// WriteGenericCredential creates or replaces a generic credential in Windows Credential Manager.
func WriteGenericCredential(c GenericCredential) error {
	cred := credentialW{
		Type:               credTypeGeneric,
		TargetName:         utf16PtrOrNil(c.TargetName),
		Comment:            utf16PtrOrNil(c.Comment),
		CredentialBlobSize: uint32(len(c.Blob)),
		Persist:            c.Persist,
		TargetAlias:        utf16PtrOrNil(c.TargetAlias),
		UserName:           utf16PtrOrNil(c.UserName),
	}
	if len(c.Blob) > 0 {
		cred.CredentialBlob = &c.Blob[0]
	}

	r1, _, callErr := procCredWriteW.Call(uintptr(unsafe.Pointer(&cred)), 0)
	if r1 == 0 {
		return callErr
	}
	return nil
}

// DeleteGenericCredential removes a generic credential. A missing entry is not an error.
func DeleteGenericCredential(target string) error {
	targetPtr, err := windows.UTF16PtrFromString(target)
	if err != nil {
		return err
	}

	r1, _, callErr := procCredDeleteW.Call(uintptr(unsafe.Pointer(targetPtr)), credTypeGeneric, 0)
	if r1 == 0 && !errors.Is(callErr, windows.ERROR_NOT_FOUND) {
		return callErr
	}
	return nil
}

// DPAPIProtect encrypts data so only the current Windows user can decrypt it.
func DPAPIProtect(data []byte) ([]byte, error) {
	return dpapi(data, true)
}

// DPAPIUnprotect decrypts data that was encrypted for the current Windows user.
func DPAPIUnprotect(data []byte) ([]byte, error) {
	return dpapi(data, false)
}

func dpapi(data []byte, protect bool) ([]byte, error) {
	if len(data) == 0 {
		return nil, errors.New("no data to process")
	}

	in := windows.DataBlob{Size: uint32(len(data)), Data: &data[0]}
	var out windows.DataBlob

	var err error
	if protect {
		err = windows.CryptProtectData(&in, nil, nil, 0, nil, windows.CRYPTPROTECT_UI_FORBIDDEN, &out)
	} else {
		err = windows.CryptUnprotectData(&in, nil, nil, 0, nil, windows.CRYPTPROTECT_UI_FORBIDDEN, &out)
	}
	if err != nil {
		return nil, err
	}
	defer windows.LocalFree(windows.Handle(unsafe.Pointer(out.Data)))

	result := make([]byte, out.Size)
	copy(result, unsafe.Slice(out.Data, out.Size))
	return result, nil
}

func utf16PtrOrNil(s string) *uint16 {
	if s == "" {
		return nil
	}
	ptr, _ := windows.UTF16PtrFromString(s)
	return ptr
}
