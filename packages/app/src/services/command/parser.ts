import { Message } from "chat";
import { ExecutableCommand } from ".";

export function parseExecutableCommand(
    message: Message,
    commandPrefix: string
): ExecutableCommand {
    const sanitizedCommandMessage = removePrefix(
        message.content,
        commandPrefix
    );
    const commandChunks = sanitizedCommandMessage.split(" ");
    const commandName = commandChunks.shift();
    return {
        name: commandName,
        arguments: commandChunks,
        userID: message.userId,
        userName: message.userName,
        message: message.content,
        source: message.source,
    };
}

function removePrefix(messageContent: string, commandPrefix: string): string {
    if (!messageContent.startsWith(commandPrefix)) {
        return messageContent;
    }
    return messageContent.slice(commandPrefix.length);
}