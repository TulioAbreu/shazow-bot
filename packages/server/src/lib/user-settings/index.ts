import { Action, ActionId } from "chat";
import type { ExecutableCommand } from "../../command/type";
import { Language } from "../../controllers/language/find-user-language";
import { getOutput } from "../../controllers/language/get-user-output";
import { setUserSettingsLanguage } from "../../controllers/user-settings";
import { Output } from "../../languages";
import type { UserSettings } from "../../models/user-settings";

export default async function Settings(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (command.arguments.length === 0) {
        return replyNoArguments(userSettings);
    }
    const commandArgs = command.arguments;
    switch (commandArgs.shift().toLowerCase()) {
    case "get":
        return await getSettings(commandArgs, userSettings);
    case "set":
        return await setSettings(commandArgs, userSettings);
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
    return {
        id: ActionId.Reply,
        body: getOutput(userSettings.language, Output.Settings.NoArguments),
    };
}

async function replyLanguage(userSettings: UserSettings): Promise<Action> {
    return {
        id: ActionId.Reply,
        body: getOutput(userSettings.language, Output.Settings.GetLanguage, [
            userSettings.language,
        ]),
    };
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
    const language = commandArgs.shift().toUpperCase() as Language;
    if (!Object.values(Language).includes(language)) {
        return replyInvalidLanguage(userSettings);
    }
    await setUserSettingsLanguage(
        userSettings.userId,
        userSettings.platform,
        language
    );
    return {
        id: ActionId.Reply,
        body: getOutput(language, Output.Settings.SetLanguageSuccess),
    };
}

function replyInvalidLanguage(userSettings: UserSettings): Action {
    return {
        id: ActionId.Reply,
        body: getOutput(
            userSettings.language,
            Output.Settings.InvalidLanguage,
            [
                Object.keys(Language)
                    .map((languageKey: string) => {
                        return `${languageKey} (${Language[languageKey]})`;
                    })
                    .join(", "),
            ]
        ),
    };
}
