import { Action, ActionId } from "chat";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import * as CommandLogDb from "database/dist/repositories/command-log";
import { GenericCommand } from "database/dist/models/generic-command";
import type { ExecutableCommand } from "../command";
import { Maybe } from "utils";

export async function executeGenericCommand(command: ExecutableCommand): Promise<Maybe<Action>> {
    const genericCommand = await GenericCommandDb.findOne(
        command.source,
        command.serverId,
        command.name
    );
    if (!genericCommand) {
        return;
    }

    return {
        id: ActionId.Reply,
        body: await processGenericCommand(command, genericCommand),
    };
}

async function processGenericCommand(
    command: ExecutableCommand,
    genericCommand: GenericCommand
): Promise<string> {
    const usageCount = hasCommandUsageCount(genericCommand.output)
        ? await CommandLogDb.count({
            source: genericCommand.source,
            serverId: genericCommand.serverId,
            commandName: genericCommand.name,
        })
        : 0;
    const output = getGenericCommandOutput(command.arguments, genericCommand, usageCount);
    return output;
}

function hasCommandUsageCount(commandOutput: string): boolean {
    return commandOutput.includes("%count");
}

function getGenericCommandOutput(
    commandArguments: string[],
    genericCommand: GenericCommand,
    usageCount: number
) {
    return commandArguments
        .reduce((currentOutput, argument, index) => {
            return currentOutput.replace(`%args${index}`, argument);
        }, genericCommand.output)
        .replace(/%args([0-9])+/g, "")
        .replace("%count", `${usageCount}`);
}
