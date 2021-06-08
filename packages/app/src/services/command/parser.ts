import { Message } from "chat";
import { Maybe } from "utils";
import { ExecutableCommand } from ".";

export function parseExecutableCommand(
    message: Message,
    commandPrefix: string
): Maybe<ExecutableCommand> {
    const sanitizedCommandMessage = removePrefix(
        message.content,
        commandPrefix
    );
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
