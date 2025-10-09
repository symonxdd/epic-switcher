package models

type LoginSession struct {
	Username   string `json:"username"`
	UserID     string `json:"userId"`
	Alias      string `json:"alias"`
	LoginToken string `json:"loginToken"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}
