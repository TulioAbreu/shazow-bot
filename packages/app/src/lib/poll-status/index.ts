import type { ExecutableCommand } from "../../services/command";
import type { UserSettings } from "database/dist/models/user-settings";
import { getPollStatus, PollStatus, PollStatusOption } from "../../services/poll";
import { Poll } from "database/dist/models/poll";
import { Language, Output, getOutput } from "../../services/language";
import { Action, ChatClient, createChatReply, Source } from "chat";
import * as PollDb from "database/dist/repositories/poll";
import { isPollDisabled } from "../../services/poll";
import { Maybe } from "utils";

export default async function PollStatus(
    _client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    const poll = await getLastFinishedPoll();
    if (!poll?._id) {
        return createChatReply(
            getOutput(Output.PollStatusNoRecentPolls, userSettings.language as Language)
        );
    }
    const pollStatus = await getPollStatus(poll._id);
    if (!pollStatus) {
        return createChatReply(
            getOutput(Output.PollStatusNoRecentPolls, userSettings.language as Language)
        );
    }
    switch (command.source) {
        case Source.Twitch:
            return renderDiscordResult(pollStatus, userSettings.language as Language);
        case Source.Discord:
        default:
            return renderDiscordResult(pollStatus, userSettings.language as Language);
    }
}

function renderDiscordResult(pollStatus: PollStatus, language: Language): Action {
    return createChatReply(
        getOutput(Output.PollStatusSuccessDiscord, language, [
            pollStatus.question,
            pollStatus.options
                .map((option: PollStatusOption) => {
                    return getOutput(Output.PollStatusSuccessDiscordOption, language, [
                        option.option,
                        (option.votes ?? 0).toString(),
                    ]);
                })
                .join("\n"),
        ])
    );
}

async function getLastFinishedPoll(): Promise<Maybe<Poll>> {
    const disabledPolls = (await PollDb.find()).filter(isPollDisabled);
    if (!disabledPolls?.length) {
        return;
    }
    return disabledPolls.reduce((lastFinishedPoll, poll) => {
        if (poll.expiresAt.getTime() > lastFinishedPoll.expiresAt.getTime()) {
            return poll;
        } else {
            return lastFinishedPoll;
        }
    }, disabledPolls[0]);
}
