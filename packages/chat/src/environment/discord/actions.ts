import * as DiscordJs from "discord.js";

export async function replyMessage(
    discordMessage: DiscordJs.Message,
    responseStr: string
): Promise<void> {
    if (!responseStr) {
        return;
    }
    discordMessage.reply(responseStr);
}
