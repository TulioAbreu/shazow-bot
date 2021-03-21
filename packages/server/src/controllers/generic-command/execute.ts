import { Action, ActionId } from "chat";
import { ExecutableCommand } from "../../command/type";
import { findGenericCommand } from "./find";
import { GenericCommand } from "./type";

export async function executeGenericCommand(
    command: ExecutableCommand
): Promise<Action> {
    if (!command || !command.name?.length) {
        return;
    }
    const dbCommand = (await findGenericCommand(
        command.name
    )) as GenericCommand;
    if (!dbCommand) {
        return;
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
