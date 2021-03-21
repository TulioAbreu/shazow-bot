import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import { getOutput } from "../../controllers/language/get-user-output";
import { findActivePolls } from "../../controllers/poll";
import { createVote } from "../../controllers/vote/create";
import { Output } from "../../languages";
import { Poll } from "../../models/poll";
import { UserSettings } from "../../models/user-settings";
import { Vote } from "../../models/vote";

export default async function Vote(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Vote.InvalidArgs),
        };
    }
    const activePolls = await findActivePolls();
    if (!activePolls?.length) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Vote.NoActivePolls),
        };
    }
    const voteOption = getVoteOption(command.arguments);
    const pollIndex = getPollIndexFromOption(activePolls, voteOption);
    const success = await createVote({
        pollId: activePolls[pollIndex]?._id,
        username: command.userName,
        userId: command.userID,
        sentAt: new Date(),
        option: voteOption,
        source: command.source,
    } as Vote);
    return success
        ? {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Vote.Success),
        }
        : undefined;
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
