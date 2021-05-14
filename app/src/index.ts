import {
    Chat,
    DiscordClient,
    TwitchClient,
} from "chat";
import Config from "./config";
import * as mongoose from "mongoose";
import { getSecret } from "./secret";
import { onMessageCallback } from "./app";

async function main() {
    console.log("INFO - Starting...");
    const {
        port,
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
        mongoose.connect(mongodbKey, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        mongoose.set("useFindAndModify", false);
    } catch (error) {
        console.log(`ERROR - Failed to initialize message environments. Reason: ${error}`);
    } finally {
        console.log(`INFO - Bot is running`);
    }
}

main();
