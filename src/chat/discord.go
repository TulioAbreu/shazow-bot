package chat

import (
	"fmt"
	"time"

	"github.com/bwmarrin/discordgo"
)

type DiscordChat struct {
	client *discordgo.Session
}

func NewDiscordChat(token string) (*DiscordChat, error) {
	dg, err := discordgo.New("Bot " + token)
	if err != nil {
		fmt.Println("ERROR - DiscordChat::NewDiscordChat -", err)
		return nil, err
	}

	dg.Identify.Intents = discordgo.IntentsGuildMessages

	newDiscordChat := new(DiscordChat)
	newDiscordChat.client = dg

	return newDiscordChat, err
}

func (discordChat *DiscordChat) listen(handler MessageHandler) error {
	discordChat.client.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		if shouldIgnoreMessage(s, m) {
			return
		}
		message := discordParseMessage(s, m)
		action := handler(message)
		discordExecuteAction(s, m, action)
	})
	err := discordChat.client.Open()
	return err
}

func shouldIgnoreMessage(s *discordgo.Session, m *discordgo.MessageCreate) bool {
	return m.Author.Bot && s.State.User.ID == m.Author.ID
}

func discordParseMessage(s *discordgo.Session, m *discordgo.MessageCreate) Message {
	return Message{
		Source:    "discord",
		ChannelID: m.ChannelID,
		UserID:    m.Author.ID,
		Username:  m.Author.Username,
		ServerID:  m.GuildID,
		IsPing:    m.Pinned,
		SentAt:    time.Now(),
		Content:   m.Content,
	}
}

func discordExecuteAction(s *discordgo.Session, m *discordgo.MessageCreate, action Action) {
	switch action.ID {
	case ACTION_REPLY:
		s.ChannelMessageSend(m.ChannelID, action.Body)
	}
}
