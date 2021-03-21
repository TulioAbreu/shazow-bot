import PollDb from "../../models/poll";
import { isEmptyString } from "../../utils/is-empty-array";

export async function createPoll(
    question: string,
    options: string[],
    pollMinutes: number
): Promise<void> {
    if (isEmptyString(question) || !options?.length || pollMinutes <= 0) {
        return;
    }

    await PollDb.create({
        question,
        options: options,
        createdAt: new Date(),
        expiresAt: getPollExpirationDate(pollMinutes),
    });
}

function getPollExpirationDate(minutes: number): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
}
