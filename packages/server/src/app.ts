import { Action, ChatClient, createChatReply, Message, Source } from "chat";
import { UserSettings } from "./models/user-settings";
import * as UserSettingsDb from "./repositories/user-settings";
import { execute } from "./services/command";
import { parseExecutableCommand } from "./services/command/parser";
import { getOutput, Output } from "./services/language";
import Config from "./config";

const DEFAULT_PREFIX = Config.prefix;

export async function onMessageCallback(
    client: ChatClient,
    message: Message
): Promise<Action> {
    const shouldIgnoreMessageSync = getShouldIgnoreMessageSync(message, DEFAULT_PREFIX);
    if (shouldIgnoreMessageSync) {
        return;
    }

    const userSettings = await retrieveUserSettings(message.userId, message.source);

    const shouldIgnoreMessage = getShouldIgnoreMessage(userSettings);
    if (shouldIgnoreMessage) {
        return;
    }

    if (message.isPing) {
        return onPingMessage(userSettings, DEFAULT_PREFIX);
    }
    if (isCommandMessage(message.content, DEFAULT_PREFIX)) {
        return onCommandMessage(client, message, userSettings, DEFAULT_PREFIX);
    }
}

function onPingMessage(
    userSettings: UserSettings,
    prefix: string,
): Action {
    return createChatReply(
        getOutput(
            Output.Pinged,
            userSettings.language,
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
