import { Action, ChatClient, Source } from "chat";
import type { UserSettings } from "database/dist/models/user-settings";
import * as CommandLogDb from "database/dist/repositories/command-log";
import { Maybe } from "utils";
import { getConfig } from "../../config";
import { nativeCommandsMap } from "../../lib";
import { executeGenericCommand } from "../generic-command";

export interface ExecutableCommand {
    userID: string;
    userName: string;
    channelId: string;
    serverId: string;
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

    const nativeCommand = nativeCommandsMap.get(command.name);
    if (nativeCommand) {
        return nativeCommand(client, command, userSettings);
    } else {
        return executeGenericCommand(command);
    }
}

function isTrollCommand(command: ExecutableCommand): boolean {
    const config = getConfig();
    return command.message.length >= config.trollCommandThreshold;
}
