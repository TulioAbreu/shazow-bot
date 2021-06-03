package guild

import (
	"strings"
)

const (
	ChatGuildSourceDiscord = "discord"
	ChatGuildSourceTwitch  = "twitch"
)

type Guild struct {
	id     string
	source string
}

func New(id string, source string) Guild {
	guildID := sanitizedGuildID(id)
	return Guild{
		id:     guildID,
		source: source,
	}
}

func sanitizedGuildID(rawID string) string {
	return strings.ToLower(strings.TrimSpace(rawID))
}

func (guild Guild) ID() string {
	return guild.id
}

func (guild Guild) Source() string {
	return guild.source
}
