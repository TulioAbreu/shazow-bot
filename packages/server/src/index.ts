import server from "./routes";
import {
    Chat,
    DiscordClient,
    TwitchClient,
    Message,
    Action,
    ChatClient,
} from "chat";
import Config from "./config";
import * as mongoose from "mongoose";
import { getSecret } from "./secret";
import { execute } from "./services/command";
import { parseExecutableCommand } from "./services/command/parser";

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
    const onMessageCallback = async (
        client: ChatClient,
        message: Message
    ): Promise<Action> => {
        return execute(client, parseExecutableCommand(message, Config.prefix));
    };
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
        server.listen(port);
    } catch (error) {
        console.log(
            "ERROR - Failed to initialize message environments. Reason: " +
                error
        );
    } finally {
        console.log("INFO - Bot is running and listening to port " + port);
    }
}

main();
