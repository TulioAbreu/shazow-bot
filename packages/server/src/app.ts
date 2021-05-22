import { Action, ChatClient, createChatReply, Message, Source } from "chat";
import { UserSettings } from "database/lib/models/user-settings";
import * as UserSettingsDb from "database/lib/repositories/user-settings";
import { execute } from "./services/command";
import { parseExecutableCommand } from "./services/command/parser";
import { getOutput, Language, Output } from "./services/language";
import Config from "./config";

const prefix = Config.prefix;

export async function onMessageCallback(
    client: ChatClient,
    message: Message
): Promise<Action> {
    const shouldIgnoreMessageSync = getShouldIgnoreMessageSync(message, prefix);
    if (shouldIgnoreMessageSync) {
        return;
    }

    const userSettings = await retrieveUserSettings(message.userId, message.source);
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

function onPingMessage(
    userSettings: UserSettings,
    prefix: string,
): Action {
    return createChatReply(
        getOutput(
            Output.Pinged,
            userSettings.language as Language,
            [prefix]
        )
    );
}

function onCommandMessage(
    client: ChatClient,
    message: Message,
    userSettings: UserSettings,
    prefix: string,
): Promise<Action> {
    const command = parseExecutableCommand(message, prefix);
    return execute(client, userSettings, command);
}

function isCommandMessage(content: string, commandPrefix: string): boolean {
    if (!content) {
        return false;
    }
    return content.startsWith(commandPrefix);
}

function getShouldIgnoreMessageSync(message: Message, prefix: string): boolean {
    return !(message.isPing || isCommandMessage(message.content, prefix));
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
