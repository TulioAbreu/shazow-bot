package main

import (
	"os"
	"os/signal"
	"syscall"

	"./bot"
	"./chat"
	env "./dotenv"
	logger "./logger"
)

func main() {
	logger.Log(logger.LOG_INFO, "Starting ShazowBot...")
	env.StartEnvironment()

	chatInstance := chat.NewChat()
	chatInstance.SetHandler(bot.MessageHandler)

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
