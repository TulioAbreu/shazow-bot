import PollDb, { Poll } from "../models/poll";
import { asArray } from "../utils/as-array";
import { isEmptyString } from "../utils/is-empty-array";

export async function create(
    question: string,
    options: string[],
    pollMinutes: number
): Promise<Poll> {
    function getPollExpirationDate(
        startDate: Date,
        durationMinutes: number
    ): Date {
        const expiresAt = new Date(startDate);
        expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);
        return expiresAt;
    }

    if (isEmptyString(question) || !options?.length || pollMinutes <= 0) {
        return;
    }
    return PollDb.create({
        question,
        options,
        createdAt: new Date(),
        expiresAt: getPollExpirationDate(new Date(), pollMinutes),
    });
}

export async function find(): Promise<Poll[]> {
    return asArray<Poll>(await PollDb.find().lean());
}

export async function findById(id: string): Promise<Poll> {
    return PollDb.findById(id).lean();
}
