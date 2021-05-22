import config from "../../config";
import CreateGenericCommand from "../../lib/create-command";
import DeleteGenericCommand from "../../lib/delete-command";
import Ping from "../../lib/ping";
import Pong from "../../lib/pong";
import Random from "../../lib/random";
import type { UserSettings } from "database/lib/models/user-settings";
import { executeGenericCommand } from "../generic-command";
import Anime from "../../lib/anilist";
import Poll from "../../lib/poll";
import Vote from "../../lib/vote";
import PollStatus from "../../lib/poll-status";
import * as CommandLogDb from "database/lib/repositories/command-log";
import Settings from "../../lib/user-settings";
import { Action, ChatClient, Source } from "chat";
import Weather from "../../lib/weather";
import Help from "../../lib/help";

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
            return Anime(command, userSettings);
        case "poll":
            return Poll(command, userSettings);
        case "vote":
            return Vote(command, userSettings);
        case "pollStatus":
            return PollStatus(command, userSettings);
        case "settings":
            return Settings(command, userSettings);
        case "createCommand":
            return CreateGenericCommand(command, userSettings);
        case "deleteCommand":
            return DeleteGenericCommand(command, userSettings);
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
