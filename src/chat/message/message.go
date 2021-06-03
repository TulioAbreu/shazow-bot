package message

import (
	"time"

	"../author"
	"../guild"
)

type Message struct {
	guild     guild.Guild
	author    author.Author
	channelID string
	content   string
	sentAt    time.Time
	isPing    bool
}

func New(
	guild guild.Guild,
	author author.Author,
	channelID string,
	content string,
	isPing bool,
) Message {
	return Message{
		guild:     guild,
		author:    author,
		content:   content,
		sentAt:    time.Now(),
		channelID: channelID,
		isPing:    isPing,
	}
}

func (message Message) Author() author.Author {
	return message.author
}

func (message Message) Guild() guild.Guild {
	return message.guild
}

func (message Message) Content() string {
	return message.content
}

func (message Message) SentAt() time.Time {
	return message.sentAt
}

func (message Message) IsPing() bool {
	return message.isPing
}

func (message Message) ChannelID() string {
	return message.channelID
}
