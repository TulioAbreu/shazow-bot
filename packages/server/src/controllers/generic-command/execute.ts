import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import { findGenericCommand } from "./find";

export async function executeGenericCommand(
    command: ExecutableCommand
): Promise<Action> {
    if (!command || !command.name?.length) {
        return;
    }
    let dbCommand = await findGenericCommand(command.name);

    if (!dbCommand) {
        return;
    }

    if (Array.isArray(dbCommand)) {
        dbCommand = dbCommand.shift();
    }

    let output = dbCommand.output;
    for (let i = 0; i < command.arguments.length; ++i) {
        output = output.replace(`%args${i}`, command.arguments[i]);
    }
    return {
        id: ActionId.Reply,
        body: output,
    };
}
