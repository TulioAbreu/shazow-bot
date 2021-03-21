import PollDb from "../../models/poll";
import VotesDb, { Vote } from "../../models/vote";

export interface PollStatus {
    question: string;
    options: PollStatusOption[];
}

export interface PollStatusOption {
    option: string;
    votes: number;
}

export async function getPollStatus(pollId: string): Promise<PollStatus> {
    const poll = await PollDb.findOne({
        _id: pollId,
    });
    if (!poll) {
        return;
    }
    const pollVotes = await VotesDb.find({
        pollId: pollId,
    });
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
