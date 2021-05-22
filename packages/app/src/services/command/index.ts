import { Action, ChatClient, Source } from "chat";
import type { UserSettings } from "database/lib/models/user-settings";
import * as CommandLogDb from "database/lib/repositories/command-log";
import config from "../../config";
import { Ping, Pong, Random, Anilist, CreateCommand, DeleteCommand, Help, Poll, PollStatus, Settings, Vote, Weather } from "../../lib";
import { executeGenericCommand } from "../generic-command";

export interface ExecutableCommand {
    userID: string;
    userName: string;
    name: string;
    message: string;
    arguments: string[];
    source: Source;
}

export async function execute(
    client: ChatClient,
    userSettings: UserSettings,
    command: ExecutableCommand
): Promise<Action> {
    if (isTrollCommand(command)) {
        return;
    }

    CommandLogDb.save({
        author: command.userName,
        commandName: command.name,
        message: command.message,
        source: command.source,
        sentAt: new Date(),
    });

    switch (command.name) {
        case "ping":
            return Ping();
        case "pong":
            return Pong();
        case "random":
            return Random(command);
        case "anime":
            return Anilist(command, userSettings);
        case "poll":
            return Poll(command, userSettings);
        case "vote":
            return Vote(command, userSettings);
        case "pollStatus":
            return PollStatus(command, userSettings);
        case "settings":
            return Settings(command, userSettings);
        case "createCommand":
            return CreateCommand(command, userSettings);
        case "deleteCommand":
            return DeleteCommand(command, userSettings);
        case "weather":
            return Weather(command, userSettings);
        case "help":
            return Help(command, userSettings);
        default:
            return executeGenericCommand(command);
    }
}

function isTrollCommand(command: ExecutableCommand): boolean {
    return command.message.length >= config.trollCommandThreshold;
}
