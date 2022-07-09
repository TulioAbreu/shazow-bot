import { Action, ChatClient, createChatReply, Source } from "chat";
import { ExecutableCommand } from "../../services/command";
import { Output, getOutput, Language } from "../../services/language";
import { Poll } from "database/dist/models/poll";
import { UserSettings } from "database/dist/models/user-settings";
import * as PollDb from "database/dist/repositories/poll";
import { Maybe } from "utils";
import { getPollStatus, PollStatus, PollStatusOption } from "../../services/poll";
import { getUserRole } from "../role";
import { Role } from "database/dist/types";

interface ParsedPoll {
    question: string;
    options: string[];
}

export default async function Poll(
    client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return createChatReply(
            getOutput(Output.PollInvalidArgs, userSettings.language as Language)
        );
    }
    const userRole = getUserRole(userSettings, command.source, command.channelId);
    if (!isAllowedToStartPoll(userRole)) {
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
    const createdPoll = await PollDb.create(question, options, pollMinutes);
    setTimeout(() => {
        publishPollResult(client, userSettings, command, createdPoll?._id);
    }, pollMinutes * 60 * 1000);
    return createChatReply(
        getOutput(Output.PollSuccess, userSettings.language as Language, [
            `${pollMinutes}`,
            question,
            options.join(", "),
        ])
    );
}

/**
 * TODO: It will not work if the bot is restarted before ending the poll.
 * Maybe could add something that stores future events in database
 * and execute those events
 */
async function publishPollResult(
    client: ChatClient,
    userSettings: UserSettings,
    createPollCommand: ExecutableCommand,
    pollId?: string
): Promise<void> {
    const pollStatus = await getPollStatus(pollId ?? "");
    if (!pollStatus) {
        console.error("Failed to publish poll result");
        return;
    }
    const response = renderPollResult(pollStatus, createPollCommand.source, userSettings);
    client.sendMessage(createPollCommand.channelId, response);
}

function renderPollResult(
    pollStatus: PollStatus,
    commandSource: Source,
    userSettings: UserSettings
): string {
    function getOutputBySource(): Output[] {
        if (commandSource === Source.Discord) {
            return [Output.PollStatusSuccessDiscord, Output.PollStatusSuccessDiscordOption];
        } else {
            return [Output.PollStatusSuccessTwitch, Output.PollStatusSuccessTwitchOption];
        }
    }

    const [pollStatusOutput, optionStatusOutput] = getOutputBySource();
    return getOutput(pollStatusOutput, userSettings.language as Language, [
        pollStatus.question,
        pollStatus.options
            .map((option: PollStatusOption): string => {
                return getOutput(optionStatusOutput, userSettings.language as Language, [
                    option.option,
                    (option.votes ?? 0).toString(),
                ]);
            })
            .join("\n"),
    ]);
}

function checkPollParameters(question = "", options: string[] = [], pollMinutes: number): boolean {
    return !!question.length && !!options.length && !isNaN(pollMinutes);
}

function isAllowedToStartPoll(role: Role): boolean {
    return role === Role.Admin || role === Role.Trusted;
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
