import CommandDb from "../../models/generic-command";
import { GenericCommand } from "./type";

export async function findGenericCommand(
    commandName?: string
): Promise<GenericCommand | GenericCommand[]> {
    if (!commandName?.length) {
        return findAll();
    } else {
        return findOne(commandName);
    }
}

async function findAll(): Promise<GenericCommand[]> {
    const genericCommands = await CommandDb.find().lean();
    return genericCommands as GenericCommand[];
}

async function findOne(commandName: string): Promise<GenericCommand> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
    }).lean();
    return (genericCommand as GenericCommand) ?? undefined;
}
