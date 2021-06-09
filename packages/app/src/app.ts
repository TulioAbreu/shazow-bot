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
    if (!shouldProcessMessage(message, prefix)) {
        return;
    }

    const userSettings = await retrieveUserSettings(message.userId as string, message.source);
    if (shouldIgnoreMessage(userSettings)) {
        return;
    }

    return processMessage(client, message, userSettings);
}

async function processMessage(
    client: ChatClient,
    message: Message,
    userSettings: UserSettings
): Promise<Maybe<Action>> {
    if (message.isPing) {
        return onPingMessage(userSettings, prefix);
    }
    if (isCommandMessage(message.content, prefix)) {
        return onCommandMessage(client, message, userSettings, prefix);
    }
}

function shouldProcessMessage(message: Message, prefix: string): boolean {
    if (message.isPing) {
        return true;
    }
    if (isCommandMessage(message.content, prefix)) {
        return true;
    }
    return false;
}

function onPingMessage(userSettings: UserSettings, prefix: string): Action {
    return createChatReply(getOutput(Output.Pinged, userSettings.language as Language, [prefix]));
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

async function retrieveUserSettings(userId: string, userSource: Source): Promise<UserSettings> {
    const userSettings = await UserSettingsDb.findOne(userId, userSource);
    if (userSettings) {
        return userSettings;
    } else {
        return UserSettingsDb.create(userId, userSource);
    }
}

function shouldIgnoreMessage(userSettings: UserSettings): boolean {
    return userSettings.isIgnored;
}
