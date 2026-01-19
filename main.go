package main

import (
	"context"
	"embed"

	"epic-games-account-switcher/backend"
	"epic-games-account-switcher/backend/middleware"
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

	// Get avatar directory once at startup
	avatarDir := sessionStore.GetAvatarDir()

	err := wails.Run(&options.App{
		Title:     "Epic Switcher",
		Width:     960,
		Height:    580,
		Frameless: true,
		AssetServer: &assetserver.Options{
			Assets:     assets,
			Middleware: middleware.AvatarHandler(avatarDir),
		},
		OnStartup: func(ctx context.Context) {
			app.Startup(ctx)
			services.SetAvatarServiceContext(avatarService, ctx)
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
