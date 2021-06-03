package bot

import (
	"strings"

	action "../chat/action"
	message "../chat/message"
	command "./command"
)

func isCommand(msg string, commandPrefix string) bool {
	return strings.HasPrefix(msg, commandPrefix)
}

func MessageHandler(msg message.Message) action.Action {
	if !isCommand(msg.Content(), "$") {
		return action.NewActionNone()
	}
	cmd := command.New(msg)
	return cmd.Execute()
}
