import { Message } from "chat";
import { Maybe } from "utils";
import { ExecutableCommand } from ".";

export function parseExecutableCommand(
    message: Message,
    commandPrefix: string
): Maybe<ExecutableCommand> {
    const sanitizedCommandMessage = removePrefix(message.content, commandPrefix);
    const commandChunks = sanitizedCommandMessage.split(" ");
    const [commandName, ...commandArgs] = commandChunks;
    if (!message.userId || !message.userName) {
        return;
    }
    return {
        name: commandName,
        arguments: commandArgs,
        userID: message.userId,
        userName: message.userName,
        channelId: message.channelId,
        message: message.content,
        source: message.source,
        serverId: message.serverId,
    };
}

function removePrefix(messageContent: string, commandPrefix: string): string {
    if (!messageContent.startsWith(commandPrefix)) {
        return messageContent;
    }
    return messageContent.slice(commandPrefix.length);
}
