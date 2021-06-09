import CommandDb, { GenericCommand } from "../models/generic-command";
import { asArray, Maybe } from "utils";

export async function save(command: GenericCommand): Promise<GenericCommand> {
    const { name, output, isCacheable } = command;

    async function create(): Promise<GenericCommand> {
        return await CommandDb.create({
            name,
            output,
            isCacheable,
            createdAt: new Date(),
        });
    }

    async function updateExistent(): Promise<GenericCommand> {
        return CommandDb.findOneAndUpdate(
            {
                name,
            },
            {
                name,
                output,
                isCacheable: commandFromDB.isCacheable,
                createdAt: commandFromDB.createdAt,
            }
        ).lean();
    }

    const commandFromDB = await CommandDb.findOne({ name }).lean<GenericCommand>();
    if (!commandFromDB) {
        return create();
    } else {
        return updateExistent();
    }
}

export async function findAll(): Promise<GenericCommand[]> {
    const genericCommands = await CommandDb.find().lean();
    return asArray(genericCommands);
}

export async function findOne(commandName: string): Promise<Maybe<GenericCommand>> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
    }).lean<Maybe<GenericCommand>>();
    return genericCommand ?? undefined;
}

export async function remove(commandName: string): Promise<Maybe<GenericCommand>> {
    const operationResult = await CommandDb.findOneAndDelete({
        name: commandName,
    }).lean<Maybe<GenericCommand>>();
    return operationResult ?? undefined;
}
