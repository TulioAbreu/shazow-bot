import { Chat, DiscordClient, TwitchClient } from "chat";
import { getConfig } from "./config";
import { databaseConnect } from "database/dist";
import { getSecret } from "utils/dist/secret";
import { onMessageCallback } from "./app";
import { registerJobs } from "./jobs";
import { ScheduledTask } from "node-cron";

const chat = new Chat();
let jobs: ScheduledTask[] = [];

async function main() {
    console.log("INFO - Starting...");
    const { mongodbKey, discordToken, twitchToken, twitchUsername } = getSecret();
    const { twitchChannels } = getConfig();
    try {
        chat.addClient(
            await new DiscordClient(onMessageCallback).authenticate({
                token: discordToken,
            })
        );
        chat.addClient(
            await new TwitchClient(onMessageCallback).authenticate({
                username: twitchUsername,
                token: twitchToken,
                channels: twitchChannels,
            })
        );
        chat.listen();
        databaseConnect(mongodbKey);

        jobs = registerJobs(chat);

        console.log("INFO - ShazowBot is running");
    } catch (error) {
        console.log(`ERROR - Failed to initialize message environments. Reason: ${error}`);
    }
}

async function quit(): Promise<void> {
    console.log("INFO - Disconnecting...");
    await chat.stop();
    await Promise.all(jobs.map((job) => job.stop()));
}

process.on("SIGINT", quit);

main();
