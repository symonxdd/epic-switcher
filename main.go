package main

import (
	"context"
	"embed"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"epic-games-account-switcher/backend"
	"epic-games-account-switcher/backend/services"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := backend.NewApp()
	authService := services.NewAuthService()
	sessionStore := services.NewSessionStore()
	logReader := services.NewLogReaderService()
	switchService := services.NewSwitchService()
	ignoreService := services.NewIgnoreListStore()
	systemService := services.NewSystemService()
	updateService := services.NewUpdateService()
	avatarService := services.NewAvatarService()

	err := wails.Run(&options.App{
		Title:     "Epic Switcher",
		Width:     960,
		Height:    580,
		Frameless: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
			Middleware: func(next http.Handler) http.Handler {
				return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					const prefix = "/custom-avatar/"
					if strings.HasPrefix(r.URL.Path, prefix) {
						filename := strings.TrimPrefix(r.URL.Path, prefix)
						avatarPath := filepath.Join(sessionStore.GetAvatarDir(), filename)
						fmt.Printf("🖼️ Avatar request (via Middleware): %s (Resolved: %s)\n", filename, avatarPath)

						if _, err := os.Stat(avatarPath); err == nil {
							fmt.Printf("✅ Avatar found on disk, serving...\n")
							http.ServeFile(w, r, avatarPath)
							return
						} else {
							fmt.Printf("❌ Avatar NOT found on disk: %v\n", err)
						}
					}
					next.ServeHTTP(w, r)
				})
			},
		},
		OnStartup: func(ctx context.Context) {
			app.Startup(ctx)
			avatarService.SetContext(ctx)
		},
		BackgroundColour: &options.RGBA{R: 16, G: 16, B: 16, A: 1},
		Bind: []interface{}{
			app,
			authService,
			sessionStore,
			logReader,
			switchService,
			ignoreService,
			systemService,
			updateService,
			avatarService,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
