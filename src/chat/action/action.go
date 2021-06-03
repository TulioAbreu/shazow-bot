package action

const (
	ChatActionNone  = 0
	ChatActionReply = 1
)

type Action struct {
	id   int
	body string
}

func new(id int, body string) Action {
	return Action{
		id:   id,
		body: body,
	}
}

func NewActionNone() Action {
	return new(ChatActionNone, "")
}

func NewActionReply(body string) Action {
	return new(ChatActionReply, body)
}

func (action Action) ID() int{
	return action.id
}

func (action Action) Body() string {
	return action.body
}
