package services

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// AvatarService handles avatar-related operations.
type AvatarService struct {
	ctx          context.Context
	sessionStore *SessionStore
}

// NewAvatarService creates a new AvatarService instance.
func NewAvatarService() *AvatarService {
	return &AvatarService{
		sessionStore: NewSessionStore(),
	}
}

// Startup sets the context for the service.
func (a *AvatarService) Startup(ctx context.Context) {
	a.ctx = ctx
}

// SelectAndSaveAvatar opens a file dialog, copies the selected image to the app's avatar directory,
// updates the session store, and returns the unique filename.
func (a *AvatarService) SelectAndSaveAvatar(userID string) (string, error) {
	if userID == "" {
		return "", fmt.Errorf("userID is required")
	}

	if a.ctx == nil {
		return "", fmt.Errorf("context not set for AvatarService")
	}

	// 1. Open file dialog
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Avatar Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Images (*.png;*.jpg;*.jpeg;*.webp;*.gif;*.svg)",
				Pattern:     "*.png;*.jpg;*.jpeg;*.webp;*.gif;*.svg",
			},
		},
	})

	if err != nil {
		return "", err
	}
	if selection == "" {
		return "", nil // User cancelled
	}

	// 2. Prepare destination directory
	avatarDir := a.sessionStore.GetAvatarDir()
	if err := os.MkdirAll(avatarDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create avatar directory: %w", err)
	}

	// 3. Generate unique filename (keep extension)
	ext := filepath.Ext(selection)
	destFilename := fmt.Sprintf("%s%s", userID, ext)
	destPath := filepath.Join(avatarDir, destFilename)

	// 4. Copy file
	source, err := os.Open(selection)
	if err != nil {
		return "", err
	}
	defer source.Close()

	dest, err := os.Create(destPath)
	if err != nil {
		return "", err
	}
	defer dest.Close()

	if _, err := io.Copy(dest, source); err != nil {
		return "", err
	}

	// 5. Update session store
	if err := a.sessionStore.UpdateAvatar(userID, destFilename); err != nil {
		return "", fmt.Errorf("failed to update session store: %w", err)
	}

	return destFilename, nil
}
