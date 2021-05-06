import * as Tmi from "tmi.js";

export async function replyMessage(
    client: Tmi.Client,
    target: string,
    username: string,
    response: string
): Promise<void> {
    client.say(target, `@${username} ${response}`);
}
