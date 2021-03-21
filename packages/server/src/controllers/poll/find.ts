import PollDb, { Poll } from "../../models/poll";

export async function findPolls(): Promise<Poll[]> {
    return PollDb.find();
}
