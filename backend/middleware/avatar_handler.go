package middleware

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

// AvatarHandler creates a middleware that intercepts requests for custom avatars
// and serves them from the local app data directory.
func AvatarHandler(avatarDir string) assetserver.Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// 1. Handle Thumbnails
			const thumbPrefix = "/avatar-thumb/"
			if strings.HasPrefix(r.URL.Path, thumbPrefix) {
				filename := strings.TrimPrefix(r.URL.Path, thumbPrefix)
				ext := filepath.Ext(filename)
				base := strings.TrimSuffix(filename, ext)
				thumbFilename := base + "_thumb" + ext
				thumbPath := filepath.Join(avatarDir, thumbFilename)

				if _, err := os.Stat(thumbPath); err == nil {
					http.ServeFile(w, r, thumbPath)
					return
				}
				http.NotFound(w, r)
				return
			}

			// 2. Handle Original Images
			const prefix = "/avatar-full/"
			if strings.HasPrefix(r.URL.Path, prefix) {
				filename := strings.TrimPrefix(r.URL.Path, prefix)
				avatarPath := filepath.Join(avatarDir, filename)

				if _, err := os.Stat(avatarPath); err == nil {
					http.ServeFile(w, r, avatarPath)
					return
				}
			}

			// 3. Fallback to default asset server
			next.ServeHTTP(w, r)
		})
	}
}
