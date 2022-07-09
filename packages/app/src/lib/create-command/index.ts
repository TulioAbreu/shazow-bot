import { Action, ChatClient, createChatReply } from "chat";
import { ExecutableCommand } from "../../services/command";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import type { UserSettings } from "database/dist/models/user-settings";
import { Role } from "../../types";
import { getOutput, Language, Output } from "../../services/language";
import { getUserRole } from "../role";

export default async function CreateCommand(
    _client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    const userRole = getUserRole(userSettings, command.source, command.serverId);
    if (userRole === undefined || !isAllowedToCreateCommand(userRole)) {
        return createChatReply(
            getOutput(Output.CreateCommandAccessNegated, userSettings.language as Language)
        );
    }

    const [name, ...output] = command.arguments;
    if (!hasValidArguments(name, output)) {
        return createChatReply(
            getOutput(Output.CreateCommandInvalidArguments, userSettings.language as Language)
        );
    }

    try {
        await GenericCommandDb.save({
            name: name,
            output: output.join(" "),
            createdAt: new Date(),
            serverId: command.serverId,
            source: command.source,
        });
    } catch (error) {
        if (error instanceof Error) {
            return createChatReply(
                getOutput(Output.CreateCommandFail, userSettings.language as Language, [
                    name,
                    error.message,
                ])
            );
        }
    }

    return createChatReply(
        getOutput(Output.CreateCommandSuccess, userSettings.language as Language, [name])
    );
}

function isAllowedToCreateCommand(role: Role): boolean {
    return role === Role.Admin;
}

function hasValidArguments(name: string, output: string[]): boolean {
    function isValidName(): boolean {
        return typeof name === "string" && name.length > 0;
    }

    function isValidOutput(): boolean {
        return Array.isArray(output) && output.join(" ").length > 0;
    }

    return isValidName() && isValidOutput();
}
