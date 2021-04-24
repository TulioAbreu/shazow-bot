import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../services/command";
import { getOutput } from "../../controllers/language/get-user-output";
import { findActivePolls } from "../../controllers/poll";
import * as VoteDb from "../../repositories/vote";
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
    const success = await VoteDb.save({
        pollId: activePolls[pollIndex]?._id,
        username: command.userName,
        userId: command.userID,
        sentAt: new Date(),
        option: voteOption,
        source: command.source,
    });
    if (!success) {
        return;
    }
    return {
        id: ActionId.Reply,
        body: getOutput(userSettings.language, Output.Vote.Success),
    };
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
