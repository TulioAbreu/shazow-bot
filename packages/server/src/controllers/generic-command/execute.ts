import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import * as GenericCommandDb from "../../repositories/generic-command";

export async function executeGenericCommand(
    command: ExecutableCommand
): Promise<Action> {
    if (!command || !command.name?.length) {
        return;
    }

    const genericCommand = GenericCommandDb.findOne(command.name);
    if (!genericCommand) { return; }

    const output = command.arguments.reduce((currentOutput, argument, index) => {
        return currentOutput.replace(`%args${index}`, argument);
    });

    return {
        id: ActionId.Reply,
        body: output,
    };
}
