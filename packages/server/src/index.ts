import server from "./routes";
import {
    Chat,
    DiscordEnvironment,
    Message,
    Action,
    TwitchEnvironment,
} from "chat";
import Config from "./config";
import * as mongoose from "mongoose";
import { getSecret } from "./secret";
import { execute } from "./command/execute";
import { parseExecutableCommand } from "./command/parser";

async function main() {
    console.log("INFO - Starting...");
    const {
        mongodbKey,
        discordToken,
        twitchToken,
        twitchUsername,
    } = getSecret();
    const { port, twitchChannels } = Config;
    try {
        const chat = new Chat(
            await new DiscordEnvironment().authenticate(discordToken),
            await new TwitchEnvironment(twitchChannels).authenticate(
                twitchUsername,
                twitchToken
            )
        );
        chat.setOnMessageCallback(
            async (message: Message): Promise<Action> => {
                return execute(parseExecutableCommand(message, Config.prefix));
            }
        );
        mongoose.connect(mongodbKey, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
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
