import { Action, createChatReply } from "chat";
import type { ExecutableCommand } from "../../services/command";
import { Language, Output, getOutput } from "../../services/language";
import * as UserSettingsDb from "database/dist/repositories/user-settings";

import type { UserSettings } from "database/dist/models/user-settings";

export default async function Settings(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (command.arguments.length === 0) {
        return replyNoArguments(userSettings);
    }
    const [rawMethodName, ...options] = command.arguments;
    switch (rawMethodName.toLowerCase()) {
        case "get":
            return await getSettings(options, userSettings);
        case "set":
            return await setSettings(options, userSettings);
        default:
            return replyNoArguments(userSettings);
    }
}

async function getSettings(
    commandArgs: string[],
    userSettings: UserSettings
): Promise<Action> {
    const settings = commandArgs.shift();
    switch (settings) {
        case "language":
            return replyLanguage(userSettings);
        default:
            return replyNoArguments(userSettings);
    }
}

function replyNoArguments(userSettings: UserSettings): Action {
    return createChatReply(
        getOutput(Output.SettingsNoArguments, userSettings.language as Language)
    );
}

async function replyLanguage(userSettings: UserSettings): Promise<Action> {
    return createChatReply(
        getOutput(Output.SettingsGetLanguage, userSettings.language as Language, [
            userSettings.language,
        ])
    );
}

async function setSettings(
    commandArgs: string[],
    userSettings: UserSettings
): Promise<Action> {
    const settings = commandArgs.shift();
    switch (settings) {
        case "language":
            return setLanguage(commandArgs, userSettings);
        default:
            return replyNoArguments(userSettings);
    }
}

async function setLanguage(
    commandArgs: string[],
    userSettings: UserSettings
): Promise<Action> {
    const language = commandArgs.shift() as Language;
    if (!Object.values(Language).includes(language)) {
        return replyInvalidLanguage(userSettings);
    }
    await UserSettingsDb.update(userSettings.userId, userSettings.platform, {
        language,
    });
    return createChatReply(
        getOutput(Output.SettingsSetLanguageSuccess, language, [language])
    );
}

function replyInvalidLanguage(userSettings: UserSettings): Action {
    return createChatReply(
        getOutput(Output.SettingsInvalidLanguage, userSettings.language as Language, [
            Object.keys(Language)
                .map((languageKey: string) => {
                    return `${languageKey} (${Language[languageKey]})`;
                })
                .join(", "),
        ])
    );
}
