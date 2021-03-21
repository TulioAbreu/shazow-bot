import VoteDb, { Vote } from "../../models/vote";
import { isNullOrUndefined } from "../../utils/is-null-or-undefined";

export async function createVote(vote: Vote): Promise<boolean> {
    const userCanVote = await canUserVote(vote.userId, vote.pollId);
    if (!vote || !userCanVote) {
        return false;
    }
    if (isNullOrUndefined(vote.sentAt)) {
        vote.sentAt = new Date();
    }
    await VoteDb.create(vote);
    return true;
}

async function canUserVote(userId: string, pollId: string): Promise<boolean> {
    const userVote = await VoteDb.findOne({ pollId, userId });
    return isNullOrUndefined(userVote);
}
