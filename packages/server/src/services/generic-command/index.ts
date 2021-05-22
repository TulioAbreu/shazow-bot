import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../command";
import * as GenericCommandDb from "database/lib/repositories/generic-command";
import { GenericCommand } from "database/lib/models/generic-command";

export async function executeGenericCommand(
    command: ExecutableCommand
): Promise<Action> {
    if (!command?.name?.length) {
        return;
    }

    const genericCommand = await GenericCommandDb.findOne(command.name);
    if (!genericCommand) {
        return;
    }

    const output = getGenericCommandOutput(command.arguments, genericCommand);

    return {
        id: ActionId.Reply,
        body: output,
    };
}

function getGenericCommandOutput(
    commandArguments: string[],
    genericCommand: GenericCommand
) {
    return commandArguments
        .reduce(
            (currentOutput, argument, index) => {
                return currentOutput.replace(`%args${index}`, argument);
            },
            genericCommand.output
        )
        .replace(/%args([0-9])+/g, "");
}
