import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../services/command";
import * as GenericCommandDb from "../../repositories/generic-command";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";

export default async function DeleteCommand(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (userSettings.role < Role.Admin) {
        return {
            id: ActionId.Reply,
            body: "You shall not pass!",
        };
    }

    if (!hasValidArguments(command.arguments)) {
        return {
            id: ActionId.Reply,
            body: "Invalid arguments!",
        };
    }

    await Promise.all(
        command.arguments.map(async (name: string) => {
            try {
                await GenericCommandDb.remove(name);
            } catch (error) {
                return {
                    id: ActionId.Reply,
                    body: `Failed to remove command ${name}. Error: ${error}`,
                };
            }
        })
    );

    return {
        id: ActionId.Reply,
        body: `Commands removed: ${command.arguments.join(", ")}`,
    };
}

function hasValidArguments(args: string[]): boolean {
    return Array.isArray(args) && args.length > 0;
}
