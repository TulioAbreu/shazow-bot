import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../command";
import * as GenericCommandDb from "database/lib/repositories/generic-command";

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

    const output = command.arguments.reduce(
        (currentOutput, argument, index) => {
            return currentOutput.replace(`%args${index}`, argument);
        },
        genericCommand.output
    );

    return {
        id: ActionId.Reply,
        body: output,
    };
}
