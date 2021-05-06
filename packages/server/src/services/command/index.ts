import config from "../../config";
import CreateGenericCommand from "../../lib/create-command";
import DeleteGenericCommand from "../../lib/delete-command";
import Ping from "../../lib/ping";
import Pong from "../../lib/pong";
import Random from "../../lib/random";
import type { UserSettings } from "../../models/user-settings";
import { executeGenericCommand } from "../../services/generic-command";
import Anime from "../../lib/anilist";
import Poll from "../../lib/poll";
import Vote from "../../lib/vote";
import * as UserSettingsDb from "../../repositories/user-settings";
import PollStatus from "../../lib/poll-status";
import * as CommandLogDb from "../../repositories/command-log";
import Settings from "../../lib/user-settings";
import { Action, ChatClient, Source } from "chat";
import Weather from "../../lib/weather";

export interface ExecutableCommand {
    userID: string;
    userName: string;
    name: string;
    message: string;
    arguments: string[];
    source: Source;
}

export async function execute(client: ChatClient, command: ExecutableCommand): Promise<Action> {
    if (isEmptyCommand(command) || isTrollCommand(command)) {
        return;
    }

    const userSettings = await retrieveUserSettings(
        command.userID,
        command.source
    );
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
        default:
            return executeGenericCommand(command);
    }
}

async function retrieveUserSettings(
    userId: string,
    userSource: Source
): Promise<UserSettings> {
    const userSettings = await UserSettingsDb.findOne(userId, userSource);
    if (userSettings) {
        return userSettings;
    } else {
        return UserSettingsDb.create(userId, userSource);
    }
}

function isEmptyCommand(command: ExecutableCommand): boolean {
    if (!command?.name?.length) {
        return true;
    }
    if (command.name.replace(config.prefix, "").length === 0) {
        return true;
    }
    return false;
}

function isTrollCommand(command: ExecutableCommand): boolean {
    return command.message.length >= config.trollCommandThreshold;
}
