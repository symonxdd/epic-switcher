package main

import (
	"embed"

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

	err := wails.Run(&options.App{
		Title:     "Epic Switcher",
		Width:     960,
		Height:    580,
		Frameless: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup:        app.Startup,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Bind: []interface{}{
			app,
			authService,
			sessionStore,
			logReader,
			switchService,
			ignoreService,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
