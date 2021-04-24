import CommandDb, { GenericCommand } from "../models/generic-command";

export async function save(
    command: GenericCommand,
): Promise<GenericCommand> {
    const { name, output, isCacheable } = command;

    async function create() {
        return CommandDb.create({
            name,
            output,
            isCacheable,
            createdAt: new Date(),
        });
    }

    async function updateExistent() {
        return CommandDb.findOneAndUpdate({
            name
        }, {
            name,
            output,
            isCacheable: commandFromDB.isCacheable,
            createdAt: commandFromDB.createdAt,
        }).lean();
    }

    const commandFromDB = await CommandDb.findOne({ name });
    if (!commandFromDB) {
        return create();
    } else {
        return updateExistent();
    }
}

export async function findAll(): Promise<GenericCommand[]> {
    const genericCommands = await CommandDb.find().lean();
    return genericCommands;
}

export async function findOne(commandName: string): Promise<GenericCommand> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
    }).lean();
    return genericCommand ?? undefined;
}

export async function remove(
    commandName: string,
): Promise<GenericCommand> {
    const operationResult = await CommandDb.findOneAndDelete({
        name: commandName,
    }).lean();
    return operationResult;
}
