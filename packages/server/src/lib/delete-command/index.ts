import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import { removeGenericCommand } from "../../controllers/generic-command/remove";
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

    await Promise.all(command.arguments.map(async (name: string) => {
        try {
            await removeGenericCommand(name);
        } catch (error) {
            return {
                id: ActionId.Reply,
                body: `Failed to remove command ${name}. Error: ${error}`,
            };
        }
    }));

    return {
        id: ActionId.Reply,
        body: `Commands removed: ${command.arguments.join(", ")}`,
    };
}

function hasValidArguments(args: string[]): boolean {
    return Array.isArray(args) && args.length > 0;
}
