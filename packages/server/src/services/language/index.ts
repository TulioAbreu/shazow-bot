import { readFileSync } from "fs";
import { createErrorResult, createResult, Result } from "utils";

export enum Language {
    English = "en",
    PortugueseBrazil = "pt-BR",
}

export enum Output {
    VoteInvalidArgs = "VoteInvalidArgs",
    VoteNoActivePolls = "VoteNoActivePolls",
    VoteSuccess = "VoteSuccess",
    VoteFail = "VoteFail",
    PollInvalidArgs = "PollInvalidArgs",
    PollNoPermission = "PollNoPermission",
    PollSuccess = "PollSuccess",
    AnimeNoArguments = "AnimeNoArguments",
    AnimeFetchFailed = "AnimeFetchFailed",
    AnimeSuccessDiscord = "AnimeSuccessDiscord",
    AnimeSuccessTwitch = "AnimeSuccessTwitch",
    PollStatusNoRecentPolls = "PollStatusNoRecentPolls",
    PollStatusSuccessDiscord = "PollStatusSuccessDiscord",
    PollStatusSuccessDiscordOption = "PollStatusSuccessDiscordOption",
    SettingsNoArguments = "SettingsNoArguments",
    SettingsGetLanguage = "SettingsGetLanguage",
    SettingsInvalidLanguage = "SettingsInvalidLanguage",
    SettingsSetLanguageSuccess = "SettingsSetLanguageSuccess",
    CreateCommandAccessNegated = "CreateCommandAccessNegated",
    CreateCommandInvalidArguments = "CreateCommandInvalidArguments",
    CreateCommandFail = "CreateCommandFail",
    CreateCommandSuccess = "CreateCommandSuccess",
    DeleteCommandAccessNegated = "DeleteCommandAccessNegated",
    DeleteCommandInvalidArguments = "DeleteCommandInvalidArguments",
    DeleteCommandFail = "DeleteCommandFail",
    DeleteCommandSuccess = "DeleteCommandSuccess",
    WeatherInvalidArgs = "WeatherInvalidArgs",
    WeatherLocationNotFound = "WeatherLocationNotFound",
    WeatherSuccess = "WeatherSuccess",
    WeatherFail = "WeatherFail",
    Help = "Help",
    Pinged = "Pinged"
}

const DEFAULT_LANGUAGE = Language.English;

type I18nLanguageOutputs = Record<Output, string>;
type I18nDict = Record<Language, I18nLanguageOutputs>;
const locales: I18nDict = readLocaleFiles();

export function getOutput(
    output: Output,
    rawLanguage: Language,
    args?: string[]
): string {
    const language = parseLegacyLanguage(rawLanguage);
    const rawOutput = locales[language ?? DEFAULT_LANGUAGE][output];
    return applyArgs(rawOutput, args);
}

function parseLegacyLanguage(rawLanguage: string): Language {
    if (Object.values(Language).includes(rawLanguage as Language)) {
        return rawLanguage as Language;
    }
    if (["PT", "pt"].includes(rawLanguage)) {
        return Language.PortugueseBrazil;
    }
    if (["EN", "en"].includes(rawLanguage)) {
        return Language.English;
    }
    return Language.English;
}

function applyArgs(baseOutput: string, args: string[]): string {
    if (!Array.isArray(args)) {
        return baseOutput;
    }
    return args.reduce((output: string, arg: string, index: number) => {
        return output.replace(`%args${index}`, arg);
    }, baseOutput);
}

function readLocaleFiles(): I18nDict {
    function readLocaleFile(filepath: string): Result<I18nDict> {
        try {
            const localeFileContent = readFileSync(filepath, "utf-8");
            return createResult(JSON.parse(localeFileContent));
        } catch (error) {
            console.error(
                `[ERROR] Failed to read locale file. ErrorMsg: ${error}`
            );
            return createErrorResult("Failed to read locale file");
        }
    }

    return Object.values(Language)
        .map((locale: string) => {
            const localeDict = readLocaleFile(`./locales/${locale}.json`);
            if (!localeDict.hasValue) {
                return undefined;
            }
            return { locale, localeDict: localeDict.value };
        })
        .filter((x) => x)
        .reduce((languageOutputDict, localeWithLocaleDict) => {
            return {
                [localeWithLocaleDict.locale]: localeWithLocaleDict.localeDict,
                ...languageOutputDict,
            };
        }, {}) as I18nDict;
}
