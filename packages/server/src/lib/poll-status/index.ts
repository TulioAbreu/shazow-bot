import type { ExecutableCommand } from "../../services/command";
import type { UserSettings } from "../../models/user-settings";
import { findDisabledPolls } from "../../controllers/poll";
import {
    getPollStatus,
    PollStatus,
    PollStatusOption,
} from "../../controllers/poll/get-poll-status";
import { Poll } from "../../models/poll";
import { getOutput } from "../../controllers/language/get-user-output";
import { Language } from "../../controllers/language/find-user-language";
import { Output } from "../../languages";
import { Action, ActionId, Source } from "chat";

export default async function PollStatus(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    const poll = await getLastFinishedPoll();
    if (!poll) {
        return {
            id: ActionId.Reply,
            body: getOutput(
                userSettings.language,
                Output.PollStatus.NoRecentPolls
            ),
        };
    }
    const pollStatus = await getPollStatus(poll._id);
    switch (command.source) {
        case Source.Discord:
            return renderDiscordResult(pollStatus, userSettings.language);
        case Source.Twitch:
            return renderDiscordResult(pollStatus, userSettings.language);
        default:
            return renderDiscordResult(pollStatus, userSettings.language);
    }
}

function renderDiscordResult(
    pollStatus: PollStatus,
    language: Language
): Action {
    return {
        id: ActionId.Reply,
        body: getOutput(language, Output.PollStatus.SuccessDiscord, [
            pollStatus.question,
            pollStatus.options
                .map((option: PollStatusOption) => {
                    return getOutput(
                        language,
                        Output.PollStatus.SuccessDiscordOption,
                        [option.option, (option.votes || 0).toString()]
                    );
                })
                .join("\n"),
        ]),
    };
}

async function getLastFinishedPoll(): Promise<Poll> {
    const polls = await findDisabledPolls();
    if (!polls?.length) {
        return;
    }
    let mostRecentPollTime = polls[0].expiresAt.getTime();
    let mostRecentPollIndex = 0;
    for (let i = 1; i < polls.length; ++i) {
        const pollExpirationTime = polls[i].expiresAt.getTime();
        if (pollExpirationTime > mostRecentPollTime) {
            mostRecentPollTime = pollExpirationTime;
            mostRecentPollIndex = i;
        }
    }
    return polls[mostRecentPollIndex];
}
