import CommandDb, { GenericCommand } from "../models/generic-command";
import { asArray, Maybe } from "utils";
import { Source } from "../types";

export async function save(command: GenericCommand): Promise<GenericCommand> {
    const { name, output, source, serverId } = command;

    async function create(): Promise<GenericCommand> {
        return await CommandDb.create({
            name,
            output,
            createdAt: new Date(),
            source,
            serverId,
        });
    }

    async function updateExistent(): Promise<GenericCommand> {
        return CommandDb.findOneAndUpdate(
            {
                name,
                serverId,
                source,
            },
            {
                name,
                output,
                createdAt: commandFromDB.createdAt,
                serverId,
                source,
            }
        ).lean();
    }

    const commandFromDB = await CommandDb.findOne({
        name,
        source,
        serverId,
    }).lean<GenericCommand>();
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

export async function findOne(
    commandName: string,
    commandSource: Source,
    commandServerId: string
): Promise<Maybe<GenericCommand>> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
        source: commandSource,
        serverId: commandServerId,
    }).lean<Maybe<GenericCommand>>();
    return genericCommand ?? undefined;
}

export async function remove(
    commandName: string,
    commandSource: Source,
    commandServerId: string
): Promise<Maybe<GenericCommand>> {
    const operationResult = await CommandDb.findOneAndDelete({
        name: commandName,
        source: commandSource,
        serverId: commandServerId,
    }).lean<Maybe<GenericCommand>>();
    return operationResult ?? undefined;
}
