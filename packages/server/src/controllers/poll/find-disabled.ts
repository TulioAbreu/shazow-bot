import PollDb, { Poll } from "../../models/poll";

export async function findDisabledPolls(): Promise<Poll[]> {
    const polls = (await PollDb.find()) as Poll[];
    return polls.filter(isPollDisabled);
}

function isPollDisabled(poll: Poll): boolean {
    const currentTime = new Date().getTime();
    const pollTime = poll.expiresAt?.getTime();
    if (pollTime === null || pollTime === undefined) {
        return false;
    }
    return pollTime < currentTime;
}
