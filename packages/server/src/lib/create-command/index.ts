import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../services/command";
import * as GenericCommandDb from "../../repositories/generic-command";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";
import { getOutput, Output } from "../../services/language";

export default async function CreateCommand(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (userSettings.role < Role.Trusted) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.CreateCommandAccessNegated, userSettings.language),
        };
    }

    const [name, ...output] = command.arguments;
    if (!hasValidArguments(name, output)) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.CreateCommandInvalidArguments, userSettings.language),
        };
    }

    try {
        await GenericCommandDb.save({
            name: name,
            output: output.join(" "),
            createdAt: new Date(),
            isCacheable: false,
        });
    } catch (error) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.CreateCommandFail, userSettings.language, [name, error]),
        };
    }

    return {
        id: ActionId.Reply,
        body: getOutput(Output.CreateCommandSuccess, userSettings.language, [name]),
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
