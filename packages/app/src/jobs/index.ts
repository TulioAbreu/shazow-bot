import { Chat } from "chat";
import { schedule, ScheduledTask } from "node-cron";
import { animeNewsJob } from "./anime-news";

export function registerJobs(chat: Chat): ScheduledTask[] {
    const animeNewsScheduledJob = schedule("0 * * * *", () => {
        animeNewsJob(chat);
    });
    return [animeNewsScheduledJob];
}
