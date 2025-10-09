package backend

import "context"

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App instance
func NewApp() *App {
	return &App{}
}

// Startup is called when the app starts. The context is saved so we can use runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}
