package chat

import (
	"fmt"

	"./action"
	"./author"
	"./guild"
	"./message"

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

func discordParseMessage(s *discordgo.Session, m *discordgo.MessageCreate) message.Message {
	return message.New(
		guild.New(m.GuildID, guild.ChatGuildSourceDiscord),
		author.New(guild.ChatGuildSourceDiscord, m.Author.ID, m.Author.Username),
		m.ChannelID,
		m.Content,
		m.Pinned,
	)
}

func discordExecuteAction(s *discordgo.Session, m *discordgo.MessageCreate, a action.Action) {
	switch a.ID() {
	case action.ChatActionReply:
		replyUser(s, m, a)
	}
}

func replyUser(s *discordgo.Session, m *discordgo.MessageCreate, a action.Action) {
	msg := fmt.Sprintf("<@%s>, %s", m.Author.ID, a.Body())
	s.ChannelMessageSend(m.ChannelID, msg)
}
