import config from "../config";
import Ping from "../lib/ping";
import Pong from "../lib/pong";
import Random from "../lib/random";
import type { ExecutableCommand } from "./type";
import type { UserSettings } from "../models/user-settings";
import { executeGenericCommand } from "../controllers/generic-command/execute";
import Anime from "../lib/anilist";
import Poll from "../lib/poll";
import Vote from "../lib/vote";
import { findOneUserSettings, createUserSettings } from "../controllers/user-settings";
import PollStatus from "../lib/poll-status";
import { saveCommandLog } from "../controllers/command-log";
import Settings from "../lib/user-settings";
import { Action, Source } from "chat";

export async function execute(command: ExecutableCommand): Promise<Action> {
    if (isEmptyCommand(command) || isTrollCommand(command)) {
        return;
    }

    const userSettings = await retrieveUserSettings(command.userID, command.source);
    saveCommandLog(command);

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
    default:
        return executeGenericCommand(command);
    }
}

async function retrieveUserSettings(userId: string, userSource: Source): Promise<UserSettings> {
    const userSettings = await findOneUserSettings(userId, userSource);
    if (userSettings) {
        return userSettings;
    } else {
        return createUserSettings(userId, userSource);
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
