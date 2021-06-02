package dotenv

import (
	"errors"
	"io/ioutil"
	"os"
	"strings"

	logger "../logger"
)

type Entry struct {
	key   string
	value string
}

func StartEnvironment() {
	dotenvLines, err := readLines("./env")
	if err != nil {
		logger.Log(logger.LOG_FATAL, "dotenv/StartEnvironment - "+err.Error())
	}
	for _, line := range dotenvLines {
		entry, err := getEntryFromStr(line)
		if err != nil {
			continue
		}
		os.Setenv(entry.key, entry.value)
	}
}

func readLines(filepath string) ([]string, error) {
	data, err := ioutil.ReadFile(filepath)
	if err != nil {
		return []string{}, errors.New("failed to read '" + filepath + "'")
	}
	fileContent := string(data)
	return strings.Split(fileContent, "\n"), nil
}

func getEntryFromStr(str string) (Entry, error) {
	entryChunks := strings.SplitN(str, "=", 2)
	if len(entryChunks) != 2 {
		return Entry{}, errors.New("invalid entry")
	}
	return Entry{
		key:   entryChunks[0],
		value: entryChunks[1],
	}, nil
}
