import { Action, createChatReply } from "chat";
import { ExecutableCommand } from "../../services/command";
import { Output, getOutput } from "../../services/language";
import { Poll } from "../../models/poll";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";
import * as PollDb from "../../repositories/poll";

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
            getOutput(Output.PollInvalidArgs, userSettings.language)
        );
    }
    if (!canUserStartPoll(userSettings)) {
        return createChatReply(
            getOutput(Output.PollNoPermission, userSettings.language)
        );
    }
    const pollMinutes = parseInt(command.arguments[0]);
    const { question, options } = parsePoll(
        command.arguments.slice(1).join(" ")
    );
    if (!checkPollParameters(question, options, pollMinutes)) {
        return createChatReply(
            getOutput(Output.PollInvalidArgs, userSettings.language)
        );
    }
    await PollDb.create(question, options, pollMinutes);
    return createChatReply(
        getOutput(Output.PollSuccess, userSettings.language, [
            `${pollMinutes}`,
            question,
            options.join(", "),
        ])
    );
}

function checkPollParameters(
    question: string,
    options: string[],
    pollMinutes: number
): boolean {
    return question?.length && options?.length && !isNaN(pollMinutes);
}

async function canUserStartPoll(userSettings: UserSettings): Promise<boolean> {
    return userSettings.role > Role.None;
}

function parsePoll(message: string): ParsedPoll {
    function getQuestion(): string {
        const rawQuestion = message.split("?").shift();
        return toTitleCase(rawQuestion.trim()) + "?";
    }

    function getPollOptions(): string[] {
        const optionsStr = message.split("?").pop();
        const rawOptions = optionsStr.split(",");
        return rawOptions.map((option: string) => option.trim().toLowerCase());
    }

    if (!isValidPollMessage(message)) {
        return;
    }

    return {
        question: getQuestion(),
        options: getPollOptions(),
    };
}

function isValidPollMessage(message: string): boolean {
    return /(.+?)\?(.+,)+(.)+/.test(message);
}

function toTitleCase(str: string): string {
    const strChunks = str.split(" ");
    return strChunks
        .map((chunk: string) => {
            return chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase();
        })
        .join(" ");
}
