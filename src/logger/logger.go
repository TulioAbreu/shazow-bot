package logger

import (
	"fmt"
	"time"
)

const (
	LOG_INFO    = 0
	LOG_WARNING = 1
	LOG_ERROR   = 2
	LOG_FATAL   = 3
)

func Log(logType int, message string) {
	var logPrefix = getLogPrefix(logType)
	var timeStr = getCurrentTimeStr()
	fmt.Printf("[%s] [%s] %s\n", logPrefix, timeStr, message)
}

func LogInfo(message string) {
	Log(LOG_INFO, message)
}

func LogWarning(message string) {
	Log(LOG_WARNING, message)
}

func LogError(message string) {
	Log(LOG_ERROR, message)
}

func LogFatal(message string) {
	Log(LOG_FATAL, message)
}

func getCurrentTimeStr() string {
	currentTime := time.Now()
	return currentTime.Format(time.RFC850)
}

func getLogPrefix(logType int) string {
	switch logType {
	case LOG_INFO:
		return "INFO"
	case LOG_WARNING:
		return "WARNING"
	case LOG_ERROR:
		return "ERROR"
	case LOG_FATAL:
		return "FATAL"
	default:
		return "INFO"
	}
}
