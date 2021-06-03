package chat

import (
	"../logger"
	"./action"
	"./message"
)

type MessageHandler func(message.Message) action.Action

type Chat struct {
	messageHandler MessageHandler
	discord        *DiscordChat
}

func NewChat() *Chat {
	newChat := new(Chat)
	newChat.discord = nil
	return newChat
}

func (chat *Chat) SetDiscordEnvironment(discordChat *DiscordChat) {
	if chat == nil {
		logger.Log(logger.LOG_FATAL, "Chat::SetDiscordEnvironment - nil chat instance")
		return
	}
	chat.discord = discordChat
}

func (chat *Chat) SetHandler(handler MessageHandler) {
	if chat == nil {
		logger.Log(logger.LOG_FATAL, "Chat::SetHandler - nil chat instance")
		return
	}
	chat.messageHandler = handler
}

func (chat *Chat) Listen() {
	err := chat.discord.listen(chat.messageHandler)
	if err != nil {
		logger.Log(logger.LOG_ERROR, "Chat::Listen - "+err.Error())
	}
}
