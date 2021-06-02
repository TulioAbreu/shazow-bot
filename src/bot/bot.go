package ShazowBot

import (
	"strings"

	chat "../chat"
)

func isCommand(message string, commandPrefix string) bool {
	return strings.HasPrefix(message, commandPrefix)
}

func MessageHandler(message chat.Message) chat.Action {
	if isCommand(message)
	return chat.Action{}
}
