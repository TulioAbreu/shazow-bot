package main

import (
	"os"
	"os/signal"
	"strings"
	"syscall"

	chat "./chat"
	env "./dotenv"
	logger "./logger"
)

func isCommand(message string, commandPrefix string) bool {
	return strings.HasPrefix(message, commandPrefix)
}

func messageHandler(message chat.Message) chat.Action {
	if !isCommand(message.Content, "!") {
		return chat.Action{
			ID: chat.ACTION_NONE,
		}
	}

	switch message.Content {
	case "!ping":
		return chat.Action{
			ID:   chat.ACTION_REPLY,
			Body: "pong!",
		}
	case "!pong":
		return chat.Action{
			ID:   chat.ACTION_REPLY,
			Body: "ping!",
		}
	}

	return chat.Action{
		ID: chat.ACTION_NONE,
	}
}

func main() {
	logger.Log(logger.LOG_INFO, "Starting ShazowBot...")
	env.StartEnvironment()

	chatInstance := chat.NewChat()
	chatInstance.SetHandler(messageHandler)

	discordChat, err := chat.NewDiscordChat(os.Getenv("DISCORD_TOKEN"))
	if err != nil {
		logger.Log(logger.LOG_FATAL, "Failed to create DiscordChat instance")
		return
	}
	chatInstance.SetDiscordEnvironment(discordChat)

	chatInstance.Listen()
	logger.Log(logger.LOG_INFO, "ShazowBot is running! Press Ctrl+C to stop.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
}
