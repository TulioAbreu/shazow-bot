import VoteDb, { Vote } from "../models/vote";
import { asArray, isNullOrUndefined } from "utils";

export async function save(vote: Vote): Promise<boolean> {
    const userCanVote = await canUserVote(vote.userId, vote.pollId);
    if (!vote || !userCanVote) {
        return false;
    }
    if (!vote.sentAt) {
        vote.sentAt = new Date();
    }
    await VoteDb.create(vote);
    return true;
}

export async function findByPollId(pollId: string): Promise<Vote[]> {
    return asArray<Vote>(await VoteDb.find({ pollId }).lean());
}

async function canUserVote(userId: string, pollId: string): Promise<boolean> {
    const userVote = await VoteDb.findOne({ pollId, userId });
    return isNullOrUndefined(userVote);
}
