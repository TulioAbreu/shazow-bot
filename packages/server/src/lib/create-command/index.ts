import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import { createGenericCommand } from "../../controllers/generic-command";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";

export default async function CreateCommand(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (userSettings.role < Role.Trusted) {
        return {
            id: ActionId.Reply,
            body: "You shall not pass!",
        };
    }

    const [name, ...output] = command.arguments;
    if (!hasValidArguments(name, output)) {
        return {
            id: ActionId.Reply,
            body: "Invalid arguments!",
        };
    }

    try {
        await createGenericCommand({
            name: name,
            output: output.join(" "),
            createdAt: new Date(),
            isCacheable: false,
        });
    } catch (error) {
        return {
            id: ActionId.Reply,
            body: `Failed to create command ${name}. Error: ${error}`,
        };
    }

    return {
        id: ActionId.Reply,
        body: `Command ${name} created with success!`,
    };
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
