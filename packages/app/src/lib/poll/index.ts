import { Action, createChatReply } from "chat";
import { ExecutableCommand } from "../../services/command";
import { Output, getOutput, Language } from "../../services/language";
import { Poll } from "database/dist/models/poll";
import { UserSettings } from "database/dist/models/user-settings";
import { Role } from "../../types";
import * as PollDb from "database/dist/repositories/poll";
import { Maybe } from "utils";

interface ParsedPoll {
    question: string;
    options: string[];
}

export default async function Poll(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return createChatReply(
            getOutput(Output.PollInvalidArgs, userSettings.language as Language)
        );
    }
    if (!canUserStartPoll(userSettings)) {
        return createChatReply(
            getOutput(Output.PollNoPermission, userSettings.language as Language)
        );
    }
    const [pollMinutesStr, ...questionStr] = command.arguments;
    const pollMinutes = parseInt(pollMinutesStr, 10);
    const poll = parsePoll(questionStr.join(" "));
    if (!poll) {
        return createChatReply(
            getOutput(Output.PollInvalidArgs, userSettings.language as Language)
        );
    }

    const { question, options } = poll;
    if (!checkPollParameters(question, options, pollMinutes)) {
        return createChatReply(
            getOutput(Output.PollInvalidArgs, userSettings.language as Language)
        );
    }
    await PollDb.create(question, options, pollMinutes);
    return createChatReply(
        getOutput(Output.PollSuccess, userSettings.language as Language, [
            `${pollMinutes}`,
            question,
            options.join(", "),
        ])
    );
}

function checkPollParameters(
    question = "",
    options: string[] = [],
    pollMinutes: number
): boolean {
    return !!question.length && !!options.length && !isNaN(pollMinutes);
}

async function canUserStartPoll(userSettings: UserSettings): Promise<boolean> {
    return userSettings.role > Role.None;
}

function parsePoll(message: string): Maybe<ParsedPoll> {
    if (!isValidPollMessage(message)) {
        return;
    }
    const [question, options] = message.split("?");

    function parseQuestion(questionStr: string) {
        return `${toTitleCase(questionStr)}?`;
    }

    function parsePollOptions(optionsStr: string) {
        return optionsStr
            .split(",")
            .map((optionStr: string): string => optionStr.trim().toLowerCase());
    }

    return {
        question: parseQuestion(question),
        options: parsePollOptions(options),
    };
}

function isValidPollMessage(message: string): boolean {
    return /(.+?)\?(.*?)(,.*?)+/.test(message);
}

function toTitleCase(str: string): string {
    const strChunks = str.split(" ");
    return strChunks
        .map((chunk: string) => {
            return chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase();
        })
        .join(" ");
}
