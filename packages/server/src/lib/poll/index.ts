import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../services/command";
import { getOutput } from "../../controllers/language";
import { createPoll } from "../../controllers/poll";
import { Output } from "../../languages";
import { Poll } from "../../models/poll";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";

interface ParsedPoll {
    question: string;
    options: string[];
}

export default async function Poll(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Poll.InvalidArgs),
        };
    }
    if (!canUserStartPoll(userSettings)) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Poll.NoPermission),
        };
    }
    const pollMinutes = parseInt(command.arguments[0]);
    const { question, options } = parsePoll(
        command.arguments.slice(1).join(" ")
    );
    if (!checkPollParameters(question, options, pollMinutes)) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Poll.InvalidArgs),
        };
    }
    await createPoll(question, options, pollMinutes);
    return {
        id: ActionId.Reply,
        body: getOutput(userSettings.language, Output.Poll.Success, [
            `${pollMinutes}`,
            question,
            options.join(", "),
        ]),
    };
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
