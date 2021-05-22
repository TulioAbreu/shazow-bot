import * as PollDb from "database/dist/repositories/poll";
import * as VoteDb from "database/dist/repositories/vote";
import { Poll } from "database/src/models/poll";
import { Vote } from "database/src/models/vote";

export interface PollStatus {
    question: string;
    options: PollStatusOption[];
}

export interface PollStatusOption {
    option: string;
    votes: number;
}

export function isPollActive(poll: Poll): boolean {
    const currentTime = new Date().getTime();
    const pollTime = poll.expiresAt?.getTime();
    if (pollTime === null || pollTime === undefined) {
        return false;
    }
    return pollTime > currentTime;
}

export function isPollDisabled(poll: Poll): boolean {
    return !isPollActive(poll);
}

export async function getPollStatus(id: string): Promise<PollStatus> {
    const poll = await PollDb.findById(id);
    if (!poll) {
        return;
    }
    const pollVotes = await VoteDb.findByPollId(poll._id);
    return {
        question: poll.question,
        options: poll.options.map((option: string) =>
            getOptionVotes(option, pollVotes)
        ),
    };
}

function getOptionVotes(option: string, pollVotes: Vote[]): PollStatusOption {
    return {
        option,
        votes: pollVotes.filter((vote: Vote) => vote.option === option).length,
    };
}
