import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../services/command";
import * as GenericCommandDb from "../../repositories/generic-command";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";
import { getOutput, Output } from "../../services/language";

export default async function DeleteCommand(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (userSettings.role < Role.Admin) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.DeleteCommandAccessNegated, userSettings.language),
        };
    }

    if (!hasValidArguments(command.arguments)) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.DeleteCommandInvalidArguments, userSettings.language),
        };
    }

    await Promise.all(
        command.arguments.map(async (name: string) => {
            try {
                await GenericCommandDb.remove(name);
            } catch (error) {
                return {
                    id: ActionId.Reply,
                    body: getOutput(Output.DeleteCommandFail, userSettings.language, [name, error]),
                };
            }
        })
    );

    return {
        id: ActionId.Reply,
        body: getOutput(Output.DeleteCommandSuccess, userSettings.language, [command.arguments.join(", ")]),
    };
}

function hasValidArguments(args: string[]): boolean {
    return Array.isArray(args) && args.length > 0;
}
