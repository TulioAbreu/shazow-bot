import { Chat, DiscordClient, TwitchClient } from "chat";
import { databaseConnect } from "database/lib";
import Config from "./config";
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
    const { twitchChannels } = Config;
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
    } catch (error) {
        console.log(
            `ERROR - Failed to initialize message environments. Reason: ${error}`
        );
    }
}

main();
