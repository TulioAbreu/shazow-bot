import { Chat, DiscordClient, TwitchClient } from "chat";
import { getConfig } from "./config";
import { databaseConnect } from "database/dist";
import { getSecret } from "utils/dist/secret";
import { onMessageCallback } from "./app";

async function main() {
    console.log("INFO - Starting...");
    const {
        mongodbKey,
        discordToken,
        twitchToken,
        twitchUsername,
    } = getSecret();
    const { twitchChannels } = getConfig();
    try {
        const chat = new Chat(
            await new DiscordClient(onMessageCallback).authenticate({
                token: discordToken,
            }),
            await new TwitchClient(onMessageCallback).authenticate({
                username: twitchUsername,
                token: twitchToken,
                channels: twitchChannels,
            })
        );
        chat.listen();
        databaseConnect(mongodbKey);
        console.log("INFO - ShazowBot is running");
    } catch (error) {
        console.log(
            `ERROR - Failed to initialize message environments. Reason: ${error}`
        );
    }
}

main();
