package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"maps"
	"os"
	"path/filepath"
	"time"

	"epic-games-account-switcher/backend/helper"
	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

// The new Epic Games Launcher keeps a login in two places:
//   - Windows Credential Manager, under newLauncherCredentialTarget (the refresh token)
//   - its auth folder: the DPAPI-protected access token (which holds the
//     account ID) and auth.json (which holds the display name)
const (
	newLauncherCredentialTarget = "credentials.com.epicgames.eglv2.prod"
	newLauncherAccessTokenFile  = "access-token-prod.dpapi"
	newLauncherAuthInfoFile     = "auth.json"

	// How long to wait for the new launcher's window when minimizing it
	newLauncherWindowTimeout = 30 * time.Second
)

var errNoNewLauncherLogin = errors.New("This account needs a one-time login in the new Epic Games Launcher. Go to Manage, click Add account and log in to it there. It stays in your list, no need to remove it.")

type newLauncherAccessToken struct {
	AccountID string `json:"account_id"`
}

type newLauncherAuthInfo struct {
	Prod struct {
		AccountInfo struct {
			DisplayName string `json:"display_name"`
		} `json:"account_info"`
	} `json:"prod"`
}

// getNewLauncherLoginSession returns the account the new launcher is logged
// in to, along with everything needed to log it back in later.
func getNewLauncherLoginSession() (*models.LoginSession, error) {
	cred, err := helper.ReadGenericCredential(newLauncherCredentialTarget)
	if errors.Is(err, helper.ErrCredentialNotFound) || (err == nil && len(cred.Blob) == 0) {
		return nil, fmt.Errorf("no saved login found (user likely logged out)")
	}
	if err != nil {
		return nil, fmt.Errorf("cannot read launcher credential: %w", err)
	}

	authDir := utils.GetNewLauncherAuthPath()

	encryptedToken, err := os.ReadFile(filepath.Join(authDir, newLauncherAccessTokenFile))
	if err != nil {
		return nil, fmt.Errorf("cannot read access token file: %w", err)
	}
	tokenJSON, err := helper.DPAPIUnprotect(encryptedToken)
	if err != nil {
		return nil, fmt.Errorf("cannot decrypt access token file: %w", err)
	}
	var token newLauncherAccessToken
	if err := json.Unmarshal(tokenJSON, &token); err != nil || token.AccountID == "" {
		return nil, fmt.Errorf("no account ID found in access token file")
	}

	authFiles, err := readNewLauncherAuthFiles(authDir)
	if err != nil {
		return nil, err
	}

	protectedCredential, err := helper.DPAPIProtect(cred.Blob)
	if err != nil {
		return nil, fmt.Errorf("cannot protect launcher credential: %w", err)
	}

	authInfo := parseNewLauncherAuthInfo(authFiles[newLauncherAuthInfoFile])

	return &models.LoginSession{
		UserID:   token.AccountID,
		Username: authInfo.Prod.AccountInfo.DisplayName,
		NewLauncher: &models.NewLauncherLogin{
			Credential:            base64.StdEncoding.EncodeToString(protectedCredential),
			CredentialUserName:    cred.UserName,
			CredentialTargetAlias: cred.TargetAlias,
			CredentialComment:     cred.Comment,
			CredentialPersist:     cred.Persist,
			AuthFiles:             authFiles,
		},
	}, nil
}

// renewNewLauncherLogin stores the current login of the new launcher on its
// saved account when it changed, since the launcher replaces its tokens over time.
func renewNewLauncherLogin(current *models.LoginSession) (bool, error) {
	store := NewSessionStore()
	sessions, _ := store.LoadSessions()

	for i, s := range sessions {
		if s.UserID != current.UserID {
			continue
		}

		changed := false
		if !sameNewLauncherLogin(s.NewLauncher, current.NewLauncher) {
			sessions[i].NewLauncher = current.NewLauncher
			changed = true
		}
		if current.Username != "" && s.Username != current.Username {
			sessions[i].Username = current.Username
			changed = true
		}
		if !changed {
			return false, nil
		}

		sessions[i].UpdatedAt = time.Now().Format(time.RFC3339)
		if err := store.SaveSessions(sessions); err != nil {
			return false, fmt.Errorf("failed to update new launcher login: %w", err)
		}

		fmt.Println("🔄 New launcher login renewed for:", current.UserID)
		return true, nil
	}

	return false, nil // not stored, so nothing to renew
}

// loadNewLauncherLogin returns the saved new launcher login of an account.
func loadNewLauncherLogin(userID string) (*models.NewLauncherLogin, error) {
	sessions, err := NewSessionStore().LoadSessions()
	if err != nil {
		return nil, err
	}

	for _, s := range sessions {
		if s.UserID == userID {
			if s.NewLauncher == nil {
				return nil, errNoNewLauncherLogin
			}
			return s.NewLauncher, nil
		}
	}

	return nil, fmt.Errorf("session not found")
}

// restoreNewLauncherLogin puts a saved login back in place, so the new
// launcher starts up logged in to that account. The launcher must be closed.
func restoreNewLauncherLogin(login *models.NewLauncherLogin) error {
	credential, err := unprotectNewLauncherCredential(login)
	if err != nil {
		return err
	}

	if err := helper.WriteGenericCredential(helper.GenericCredential{
		TargetName:  newLauncherCredentialTarget,
		UserName:    login.CredentialUserName,
		TargetAlias: login.CredentialTargetAlias,
		Comment:     login.CredentialComment,
		Persist:     login.CredentialPersist,
		Blob:        credential,
	}); err != nil {
		return fmt.Errorf("cannot write launcher credential: %w", err)
	}

	authDir := utils.GetNewLauncherAuthPath()
	if err := clearNewLauncherAuthFiles(authDir); err != nil {
		return err
	}
	if err := os.MkdirAll(authDir, 0755); err != nil {
		return fmt.Errorf("cannot create auth folder: %w", err)
	}

	for name, encoded := range login.AuthFiles {
		// Saved names are plain file names, never paths
		if filepath.Base(name) != name {
			continue
		}
		data, err := base64.StdEncoding.DecodeString(encoded)
		if err != nil {
			return fmt.Errorf("cannot decode saved auth file %s: %w", name, err)
		}
		if err := os.WriteFile(filepath.Join(authDir, name), data, 0644); err != nil {
			return fmt.Errorf("cannot write auth file %s: %w", name, err)
		}
	}

	return nil
}

// clearNewLauncherLogin logs the new launcher out on this PC only, by removing
// its credential and auth files. Unlike signing out in the launcher, this
// leaves the login valid on Epic's side. The launcher must be closed.
func clearNewLauncherLogin() error {
	if err := helper.DeleteGenericCredential(newLauncherCredentialTarget); err != nil {
		return fmt.Errorf("cannot remove launcher credential: %w", err)
	}
	return clearNewLauncherAuthFiles(utils.GetNewLauncherAuthPath())
}

func readNewLauncherAuthFiles(authDir string) (map[string]string, error) {
	entries, err := os.ReadDir(authDir)
	if err != nil {
		return nil, fmt.Errorf("cannot read auth folder: %w", err)
	}

	files := map[string]string{}
	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}
		data, err := os.ReadFile(filepath.Join(authDir, entry.Name()))
		if err != nil {
			return nil, fmt.Errorf("cannot read auth file %s: %w", entry.Name(), err)
		}
		files[entry.Name()] = base64.StdEncoding.EncodeToString(data)
	}

	return files, nil
}

func clearNewLauncherAuthFiles(authDir string) error {
	entries, err := os.ReadDir(authDir)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("cannot read auth folder: %w", err)
	}

	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}
		if err := os.Remove(filepath.Join(authDir, entry.Name())); err != nil {
			return fmt.Errorf("cannot remove auth file %s: %w", entry.Name(), err)
		}
	}

	return nil
}

// parseNewLauncherAuthInfo reads a saved (base64) auth.json. Missing or
// unreadable data gives empty fields.
func parseNewLauncherAuthInfo(encoded string) newLauncherAuthInfo {
	var info newLauncherAuthInfo
	data, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return info
	}
	_ = json.Unmarshal(data, &info)
	return info
}

func unprotectNewLauncherCredential(login *models.NewLauncherLogin) ([]byte, error) {
	protected, err := base64.StdEncoding.DecodeString(login.Credential)
	if err != nil {
		return nil, fmt.Errorf("cannot decode saved credential: %w", err)
	}
	credential, err := helper.DPAPIUnprotect(protected)
	if err != nil {
		return nil, fmt.Errorf("cannot decrypt saved credential: %w", err)
	}
	return credential, nil
}

// sameNewLauncherLogin compares two logins by content. The saved credential
// can't be compared directly, as DPAPI output differs every time.
func sameNewLauncherLogin(a, b *models.NewLauncherLogin) bool {
	if a == nil || b == nil {
		return a == b
	}
	if !maps.Equal(a.AuthFiles, b.AuthFiles) {
		return false
	}

	credA, errA := unprotectNewLauncherCredential(a)
	credB, errB := unprotectNewLauncherCredential(b)
	if errA != nil || errB != nil {
		return false
	}
	return bytes.Equal(credA, credB)
}
