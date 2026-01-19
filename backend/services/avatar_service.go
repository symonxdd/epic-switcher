package services

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// ThumbnailSize is the dimension (width and height) for generated avatar thumbnails.
// Thumbnails are square and center-cropped.
const ThumbnailSize = 256

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

// setContext sets the context for the service (unexported to hide from Wails bindings).
func (a *AvatarService) setContext(ctx context.Context) {
	a.ctx = ctx
}

// SetAvatarServiceContext provides a way for other packages to set the context without exposing it to the frontend bindings.
func SetAvatarServiceContext(a *AvatarService, ctx context.Context) {
	a.setContext(ctx)
}

// SelectAndSaveAvatar opens a file dialog, copies the selected image to the app's avatar directory
// using its MD5 hash as the filename, updates the session store, and returns the unique filename.
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

	if selection == "" {
		if err != nil {
			fmt.Printf("[AvatarService] Dialog returned error but empty selection (likely cancel): %v\n", err)
		} else {
			fmt.Println("[AvatarService] Dialog cancelled by user (empty selection)")
		}
		return "", nil
	}

	if err != nil {
		return "", err
	}
	if selection == "" {
		return "", nil // User cancelled
	}

	// 2. Read file to calculate hash
	data, err := os.ReadFile(selection)
	if err != nil {
		return "", fmt.Errorf("failed to read selected file: %w", err)
	}

	hash := md5.Sum(data)
	hashStr := hex.EncodeToString(hash[:])
	fmt.Printf("[AvatarService] MD5 hash for %s: %s\n", filepath.Base(selection), hashStr)

	// 3. Prepare destination directory
	avatarDir := a.sessionStore.GetAvatarDir()
	if err := os.MkdirAll(avatarDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create avatar directory: %w", err)
	}

	// 4. Generate unique filename (hash + extension)
	ext := filepath.Ext(selection)
	destFilename := fmt.Sprintf("%s%s", hashStr, ext)
	destPath := filepath.Join(avatarDir, destFilename)

	// 5. Save file only if it doesn't exist (deduplication)
	if _, err := os.Stat(destPath); os.IsNotExist(err) {
		fmt.Printf("[AvatarService] Saving new unique avatar: %s\n", destFilename)
		if err := os.WriteFile(destPath, data, 0644); err != nil {
			return "", fmt.Errorf("failed to save avatar file: %w", err)
		}

		// 5a. Generate thumbnail
		thumbFilename := getThumbnailFilename(destFilename)
		thumbPath := filepath.Join(avatarDir, thumbFilename)
		if err := generateThumbnail(destPath, thumbPath, ThumbnailSize); err != nil {
			fmt.Printf("[AvatarService] Warning: failed to generate thumbnail: %v\n", err)
			// Continue without thumbnail - non-fatal
		} else {
			fmt.Printf("[AvatarService] Generated thumbnail: %s\n", thumbFilename)
		}
	} else {
		fmt.Printf("[AvatarService] Using existing avatar (deduplicated): %s\n", destFilename)
	}

	// 6. Update session store
	if err := a.sessionStore.UpdateAvatarImage(userID, destFilename); err != nil {
		return "", fmt.Errorf("failed to update session store: %w", err)
	}

	return destFilename, nil
}

// GetAvailableAvatars returns a list of all avatar filenames in the avatars directory.
func (a *AvatarService) GetAvailableAvatars() ([]string, error) {
	avatarDir := a.sessionStore.GetAvatarDir()

	// Ensure the directory exists
	if _, err := os.Stat(avatarDir); os.IsNotExist(err) {
		return []string{}, nil
	}

	entries, err := os.ReadDir(avatarDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read avatar directory: %w", err)
	}

	var avatars []string
	for _, entry := range entries {
		name := entry.Name()
		// Exclude thumbnail files (those ending with _thumb before extension)
		if !entry.IsDir() && !isThumbnailFile(name) {
			avatars = append(avatars, name)
		}
	}

	return avatars, nil
}

// SetAvatar sets an existing avatar file for the given userID.
func (a *AvatarService) SetAvatar(userID string, filename string) error {
	if userID == "" {
		return fmt.Errorf("userID is required")
	}
	if filename == "" {
		return fmt.Errorf("filename is required")
	}

	// Verify the file exists
	avatarPath := filepath.Join(a.sessionStore.GetAvatarDir(), filename)
	if _, err := os.Stat(avatarPath); os.IsNotExist(err) {
		return fmt.Errorf("avatar file not found: %s", filename)
	}

	return a.sessionStore.UpdateAvatarImage(userID, filename)
}

// SetAvatarColor sets a custom background color for the given userID in the session store.
func (a *AvatarService) SetAvatarColor(userID string, color string) error {
	if userID == "" {
		return fmt.Errorf("userID is required")
	}

	return a.sessionStore.UpdateAvatarColor(userID, color)
}

// RemoveAvatar clears the custom avatar for the given userID in the session store.
func (a *AvatarService) RemoveAvatar(userID string) error {
	if userID == "" {
		return fmt.Errorf("userID is required")
	}

	return a.sessionStore.UpdateAvatarImage(userID, "")
}

// DeleteAvatarFile deletes the specified avatar file and its thumbnail from the disk.
func (a *AvatarService) DeleteAvatarFile(filename string) error {
	if filename == "" {
		return fmt.Errorf("filename is required")
	}

	avatarDir := a.sessionStore.GetAvatarDir()
	avatarPath := filepath.Join(avatarDir, filename)

	// Check if file exists before trying to delete
	if _, err := os.Stat(avatarPath); os.IsNotExist(err) {
		return fmt.Errorf("avatar file not found: %s", filename)
	}

	fmt.Printf("[AvatarService] Deleting avatar file: %s\n", filename)
	if err := os.Remove(avatarPath); err != nil {
		return err
	}

	// Also delete the thumbnail if it exists
	thumbFilename := getThumbnailFilename(filename)
	thumbPath := filepath.Join(avatarDir, thumbFilename)
	if _, err := os.Stat(thumbPath); err == nil {
		fmt.Printf("[AvatarService] Deleting thumbnail: %s\n", thumbFilename)
		os.Remove(thumbPath) // Ignore error for thumbnail deletion
	}

	return nil
}

// getThumbnailFilename returns the thumbnail filename for a given original filename.
// Example: "abc123.jpg" -> "abc123_thumb.jpg"
func getThumbnailFilename(filename string) string {
	ext := filepath.Ext(filename)
	base := strings.TrimSuffix(filename, ext)
	return base + "_thumb" + ext
}

// isThumbnailFile checks if a filename is a thumbnail (ends with _thumb before extension).
func isThumbnailFile(filename string) bool {
	ext := filepath.Ext(filename)
	base := strings.TrimSuffix(filename, ext)
	return strings.HasSuffix(base, "_thumb")
}

// generateThumbnail creates a square, center-cropped thumbnail of the given size.
func generateThumbnail(srcPath, destPath string, size int) error {
	src, err := imaging.Open(srcPath)
	if err != nil {
		return fmt.Errorf("failed to open image: %w", err)
	}

	// Fill creates a center-cropped thumbnail
	thumb := imaging.Fill(src, size, size, imaging.Center, imaging.Lanczos)

	// Save as JPEG for thumbnails (good compression for photos)
	// Use the original extension to maintain format
	return imaging.Save(thumb, destPath)
}
