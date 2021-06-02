package chat

const (
	ACTION_NONE  = 0
	ACTION_REPLY = 1
)

type Action struct {
	ID   int
	Body string
}
