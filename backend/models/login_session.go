package models

type LoginSession struct {
	Username    string `json:"username"`
	UserID      string `json:"userId"`
	Alias       string `json:"alias"`
	LoginToken  string `json:"loginToken"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
	AvatarImage string `json:"avatarImage"`
	AvatarColor string `json:"avatarColor"`

	// Saved login for the new Epic Games Launcher, empty until the account
	// has been seen logged in to it
	NewLauncher *NewLauncherLogin `json:"newLauncher,omitempty"`
}

// NewLauncherLogin is what the new Epic Games Launcher needs to start up logged
// in: its Windows Credential Manager entry (the refresh token) plus the files
// in its auth folder.
type NewLauncherLogin struct {
	Credential            string            `json:"credential"` // DPAPI-protected, base64
	CredentialUserName    string            `json:"credentialUserName"`
	CredentialTargetAlias string            `json:"credentialTargetAlias"`
	CredentialComment     string            `json:"credentialComment"`
	CredentialPersist     uint32            `json:"credentialPersist"`
	AuthFiles             map[string]string `json:"authFiles"` // file name -> base64 contents
}
