import type { ExecutableCommand } from "../../services/command";
import type { UserSettings } from "database/lib/models/user-settings";
import {
    getPollStatus,
    PollStatus,
    PollStatusOption,
} from "../../services/poll";
import { Poll } from "database/lib/models/poll";
import { Language, Output, getOutput } from "../../services/language";
import { Action, createChatReply, Source } from "chat";
import * as PollDb from "database/lib/repositories/poll";
import { isPollDisabled } from "../../services/poll";

export default async function PollStatus(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    const poll = await getLastFinishedPoll();
    if (!poll) {
        return createChatReply(
            getOutput(
                Output.PollStatusNoRecentPolls,
                userSettings.language as Language
            )
        );
    }
    const pollStatus = await getPollStatus(poll._id);
    switch (command.source) {
        case Source.Twitch:
            return renderDiscordResult(
                pollStatus,
                userSettings.language as Language
            );
        case Source.Discord:
        default:
            return renderDiscordResult(
                pollStatus,
                userSettings.language as Language
            );
    }
}

function renderDiscordResult(
    pollStatus: PollStatus,
    language: Language
): Action {
    return createChatReply(
        getOutput(Output.PollStatusSuccessDiscord, language, [
            pollStatus.question,
            pollStatus.options
                .map((option: PollStatusOption) => {
                    return getOutput(
                        Output.PollStatusSuccessDiscordOption,
                        language,
                        [option.option, (option.votes ?? 0).toString()]
                    );
                })
                .join("\n"),
        ])
    );
}

async function getLastFinishedPoll(): Promise<Poll> {
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
