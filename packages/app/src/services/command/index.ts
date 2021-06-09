import { Action, ChatClient, Source } from "chat";
import type { UserSettings } from "database/dist/models/user-settings";
import * as CommandLogDb from "database/dist/repositories/command-log";
import { Maybe } from "utils";
import { getConfig } from "../../config";
import { Ping, Pong, Random, Anilist, CreateCommand, DeleteCommand, Help, Poll, PollStatus, Settings, Vote, Weather } from "../../lib";
import { executeGenericCommand } from "../generic-command";

export interface ExecutableCommand {
    userID: string;
    userName: string;
    channelId: string;
    name: string;
    message: string;
    arguments: string[];
    source: Source;
}

export async function execute(
    client: ChatClient,
    userSettings: UserSettings,
    command: ExecutableCommand
): Promise<Maybe<Action>> {
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
            return Poll(client, command, userSettings);
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
    const config = getConfig();
    return command.message.length >= config.trollCommandThreshold;
}
