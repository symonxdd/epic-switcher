package services

import (
	"fmt"
	"os"

	"epic-games-account-switcher/backend/models"
	"epic-games-account-switcher/backend/utils"
)

const rememberMePrefix = "[RememberMe]\nEnable=True\nData="

type SwitchService struct{}

func NewSwitchService() *SwitchService {
	return &SwitchService{}
}

func (s *SwitchService) SwitchAccount(session models.LoginSession) error {
	path := utils.GetEpicLoginSessionPath()
	content := fmt.Sprintf("%s%s", rememberMePrefix, session.LoginToken)
	return os.WriteFile(path, []byte(content), 0644)
}
