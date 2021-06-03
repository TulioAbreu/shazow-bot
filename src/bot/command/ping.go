package command

import (
	"../../chat/action"
)

func Ping() action.Action {
	return action.NewActionReply("pong!")
}
