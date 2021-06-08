import { Action, ChatClient, createChatReply, Message, Source } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import * as UserSettingsDb from "database/dist/repositories/user-settings";
import { execute } from "./services/command";
import { parseExecutableCommand } from "./services/command/parser";
import { getOutput, Language, Output } from "./services/language";
import { getConfig } from "./config";
import { Maybe } from "utils";

const { prefix } = getConfig();

export async function onMessageCallback(
    client: ChatClient,
    message: Message
): Promise<Maybe<Action>> {
    if (!(message.isPing || isCommandMessage(message.content, prefix))
        || !message.userId
    ) {
        return;
    }

    const userSettings = await retrieveUserSettings(
        message.userId,
        message.source
    );
    const shouldIgnoreMessage = getShouldIgnoreMessage(userSettings);
    if (shouldIgnoreMessage) {
        return;
    }

    if (message.isPing) {
        return onPingMessage(userSettings, prefix);
    }
    if (isCommandMessage(message.content, prefix)) {
        return onCommandMessage(client, message, userSettings, prefix);
    }
}

function onPingMessage(userSettings: UserSettings, prefix: string): Action {
    return createChatReply(
        getOutput(Output.Pinged, userSettings.language as Language, [prefix])
    );
}

async function onCommandMessage(
    client: ChatClient,
    message: Message,
    userSettings: UserSettings,
    prefix: string
): Promise<Maybe<Action>> {
    const command = parseExecutableCommand(message, prefix);
    if (!command) {
        return;
    }
    return await execute(client, userSettings, command);
}

function isCommandMessage(content: string, commandPrefix: string): boolean {
    if (!content) {
        return false;
    }
    return content.startsWith(commandPrefix);
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

function getShouldIgnoreMessage(userSettings: UserSettings): boolean {
    return userSettings.isIgnored;
}
