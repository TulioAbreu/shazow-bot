import { Action, createChatReply } from "chat";
import { ExecutableCommand } from "../../services/command";
import { Output, getOutput, Language } from "../../services/language";
import * as PollDb from "database/dist/repositories/poll";
import * as VoteDb from "database/dist/repositories/vote";
import { Poll } from "database/dist/models/poll";
import { UserSettings } from "database/dist/models/user-settings";
import { Vote } from "database/dist/models/vote";
import { isPollActive } from "../../services/poll";

export default async function Vote(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return createChatReply(
            getOutput(Output.VoteInvalidArgs, userSettings.language as Language)
        );
    }
    const activePolls = (await PollDb.find()).filter(isPollActive);
    if (!activePolls?.length) {
        return createChatReply(
            getOutput(Output.VoteNoActivePolls, userSettings.language as Language)
        );
    }
    const voteOption = getVoteOption(command.arguments);
    const pollIndex = getPollIndexFromOption(activePolls, voteOption);
    const poll = activePolls[pollIndex];
    if (!poll?._id) {
        return createChatReply(getOutput(Output.VoteFail, userSettings.language as Language));
    }
    const success = await VoteDb.save({
        pollId: poll._id,
        username: command.userName,
        userId: command.userID,
        sentAt: new Date(),
        option: voteOption,
        source: command.source,
    });
    if (!success) {
        return createChatReply(getOutput(Output.VoteFail, userSettings.language as Language));
    }
    return createChatReply(getOutput(Output.VoteSuccess, userSettings.language as Language));
}

function getVoteOption(args: string[]): string {
    if (!args?.length) {
        return "";
    }
    return args.join(" ").toLowerCase().trim();
}

function getPollIndexFromOption(polls: Poll[], voteOption: string): number {
    for (let i = 0; i < polls.length; ++i) {
        if (polls[i].options.includes(voteOption)) {
            return i;
        }
    }
    return -1;
}
