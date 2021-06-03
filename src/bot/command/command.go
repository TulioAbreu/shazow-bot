package command

import (
	"strings"

	"../../chat/action"
	"../../chat/message"
)

type Command struct {
	message   message.Message
	name      string
	arguments []string
}

func New(msg message.Message) Command {
	messageChunks := strings.Split(msg.Content(), " ")
	cmdName := sanitizedCommandName(messageChunks[0])
	return Command{
		message:   msg,
		name:      cmdName,
		arguments: messageChunks[1:],
	}
}

func sanitizedCommandName(commandNameChunk string) string {
	return strings.ToLower(commandNameChunk[1:])
}

func (command Command) Message() message.Message {
	return command.message
}

func (command Command) Name() string {
	return command.name
}

func (command Command) Arguments() []string {
	return command.arguments
}

func (command Command) Execute() action.Action {
	switch command.Name() {
	case "ping":
		return Ping()
	}
	return action.NewActionNone()
}
