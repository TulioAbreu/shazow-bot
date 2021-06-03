package author

type Author struct {
	source   string
	userID   string
	username string
}

func New(source string, userID string, username string) Author {
	return Author{
		source:   source,
		userID:   userID,
		username: username,
	}
}

func (author Author) Source() string {
	return author.source
}

func (author Author) UserID() string {
	return author.userID
}

func (author Author) Username() string {
	return author.username
}
