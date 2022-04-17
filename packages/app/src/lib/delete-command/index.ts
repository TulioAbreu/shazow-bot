import { Action, ChatClient, createChatReply } from "chat";
import { ExecutableCommand } from "../../services/command";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import type { UserSettings } from "database/dist/models/user-settings";
import { Role } from "../../types";
import { getOutput, Language, Output } from "../../services/language";

export default async function DeleteCommand(
    _client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (userSettings.role < Role.Admin) {
        return createChatReply(
            getOutput(Output.DeleteCommandAccessNegated, userSettings.language as Language)
        );
    }

    if (!hasValidArguments(command.arguments)) {
        return createChatReply(
            getOutput(Output.DeleteCommandInvalidArguments, userSettings.language as Language)
        );
    }

    await Promise.all(
        command.arguments.map(async (name: string) => {
            try {
                await GenericCommandDb.remove(command.source, command.serverId, name);
            } catch (error) {
                return createChatReply(
                    getOutput(
                        Output.DeleteCommandInvalidArguments,
                        userSettings.language as Language
                    )
                );
            }
        })
    );

    return createChatReply(
        getOutput(Output.DeleteCommandSuccess, userSettings.language as Language, [
            command.arguments.join(", "),
        ])
    );
}

function hasValidArguments(args: string[]): boolean {
    return Array.isArray(args) && args.length > 0;
}
