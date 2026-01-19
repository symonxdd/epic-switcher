package services

import (
	"context"
	"crypto/md5"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"
	"strings"

	_ "golang.org/x/image/webp"

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

// ImageMetadata represents technical details of an image file.
type ImageMetadata struct {
	Filename    string `json:"filename"`
	Size        int64  `json:"size"`
	FormatSize  string `json:"formatSize"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	Format      string `json:"format"`
	ContentType string `json:"contentType"`
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
		return "", nil // User cancelled
	}

	if err != nil {
		return "", err
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

// SelectImage opens a file dialog and returns the path to the selected image.
func (a *AvatarService) SelectImage() (string, error) {
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
		return "", nil // User cancelled
	}

	if err != nil {
		return "", err
	}

	return selection, nil
}

// SaveAvatarWithCrop saves an original image (if new) and generates a thumbnail with manual crop coordinates.
func (a *AvatarService) SaveAvatarWithCrop(userID string, sourcePath string, x, y, width, height int) (string, error) {
	if userID == "" {
		return "", fmt.Errorf("userID is required")
	}

	avatarDir := a.sessionStore.GetAvatarDir()
	var finalFilename string
	var fullSourcePath string

	// 1. Determine if sourcePath is an absolute path or just a filename
	if filepath.IsAbs(sourcePath) {
		// New image from disk
		data, err := os.ReadFile(sourcePath)
		if err != nil {
			return "", fmt.Errorf("failed to read source file: %w", err)
		}

		hash := md5.Sum(data)
		hashStr := hex.EncodeToString(hash[:])
		ext := filepath.Ext(sourcePath)
		finalFilename = fmt.Sprintf("%s%s", hashStr, ext)
		destPath := filepath.Join(avatarDir, finalFilename)

		// 3. Save file only if it doesn't exist (deduplication)
		if _, err := os.Stat(destPath); os.IsNotExist(err) {
			if err := os.MkdirAll(avatarDir, 0755); err != nil {
				return "", fmt.Errorf("failed to create avatar directory: %w", err)
			}
			fmt.Printf("[AvatarService] Saving new unique avatar: %s\n", finalFilename)
			if err := os.WriteFile(destPath, data, 0644); err != nil {
				return "", fmt.Errorf("failed to save avatar file: %w", err)
			}
		}
		fullSourcePath = destPath
	} else {
		// Existing image in library (re-cropping)
		finalFilename = sourcePath
		fullSourcePath = filepath.Join(avatarDir, finalFilename)
		if _, err := os.Stat(fullSourcePath); os.IsNotExist(err) {
			return "", fmt.Errorf("source avatar file not found: %s", sourcePath)
		}
		fmt.Printf("[AvatarService] Re-cropping existing avatar: %s\n", finalFilename)
	}

	// 2. Generate thumbnail with manual crop
	thumbFilename := getThumbnailFilename(finalFilename)
	thumbPath := filepath.Join(avatarDir, thumbFilename)

	if err := generateManualThumbnail(fullSourcePath, thumbPath, x, y, width, height, ThumbnailSize); err != nil {
		return "", fmt.Errorf("failed to generate manual thumbnail: %w", err)
	}
	fmt.Printf("[AvatarService] Generated manual thumbnail: %s\n", thumbFilename)

	// 3. Update session store
	if err := a.sessionStore.UpdateAvatarImage(userID, finalFilename); err != nil {
		return "", fmt.Errorf("failed to update session store: %w", err)
	}

	return finalFilename, nil
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

// ReadImageAsBase64 reads a local file and returns it as a data URL.
func (a *AvatarService) ReadImageAsBase64(path string) (string, error) {
	if path == "" {
		return "", fmt.Errorf("path is required")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	ext := strings.ToLower(filepath.Ext(path))
	mimeType := "image/jpeg"
	switch ext {
	case ".png":
		mimeType = "image/png"
	case ".webp":
		mimeType = "image/webp"
	case ".gif":
		mimeType = "image/gif"
	case ".svg":
		mimeType = "image/svg+xml"
	}

	encoded := base64.StdEncoding.EncodeToString(data)
	return fmt.Sprintf("data:%s;base64,%s", mimeType, encoded), nil
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

// GetImageMetadata returns technical details for the given avatar filename.
func (a *AvatarService) GetImageMetadata(filename string) (*ImageMetadata, error) {
	if filename == "" {
		return nil, fmt.Errorf("filename is required")
	}

	avatarDir := a.sessionStore.GetAvatarDir()
	avatarPath := filepath.Join(avatarDir, filename)

	fileInfo, err := os.Stat(avatarPath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat image file: %w", err)
	}

	// Open file to read header only (fast)
	f, err := os.Open(avatarPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open image file: %w", err)
	}
	defer f.Close()

	config, format, err := image.DecodeConfig(f)
	if err != nil {
		// Fallback for formats not registered or SVG
		if strings.ToLower(filepath.Ext(filename)) == ".svg" {
			return &ImageMetadata{
				Filename:    filename,
				Size:        fileInfo.Size(),
				FormatSize:  formatByteSize(fileInfo.Size()),
				Width:       0, // SVG dimensions are tricky without a full parser
				Height:      0,
				Format:      "svg",
				ContentType: "image/svg+xml",
			}, nil
		}
		return nil, fmt.Errorf("failed to decode image config: %w", err)
	}

	ext := strings.ToLower(filepath.Ext(filename))
	contentType := "image/unknown"
	switch ext {
	case ".png":
		contentType = "image/png"
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".webp":
		contentType = "image/webp"
	case ".gif":
		contentType = "image/gif"
	case ".svg":
		contentType = "image/svg+xml"
	}

	return &ImageMetadata{
		Filename:    filename,
		Size:        fileInfo.Size(),
		FormatSize:  formatByteSize(fileInfo.Size()),
		Width:       config.Width,
		Height:      config.Height,
		Format:      format,
		ContentType: contentType,
	}, nil
}

func formatByteSize(b int64) string {
	const unit = 1024
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(b)/float64(div), "KMGTPE"[exp])
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

// generateManualThumbnail crops the source image and resizes it to targetSize.
func generateManualThumbnail(srcPath, destPath string, x, y, w, h, targetSize int) error {
	src, err := imaging.Open(srcPath)
	if err != nil {
		return fmt.Errorf("failed to open image: %w", err)
	}

	// 1. Crop the specified area
	cropRect := image.Rect(x, y, x+w, y+h)
	cropped := imaging.Crop(src, cropRect)

	// 2. Resize to target thumbnail size
	thumb := imaging.Resize(cropped, targetSize, targetSize, imaging.Lanczos)

	// 3. Save
	return imaging.Save(thumb, destPath)
}
