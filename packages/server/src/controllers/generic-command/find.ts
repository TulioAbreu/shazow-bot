import CommandDb, { GenericCommand } from "../../models/generic-command";

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
    return genericCommands;
}

async function findOne(commandName: string): Promise<GenericCommand> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
    }).lean();
    return genericCommand ?? undefined;
}
