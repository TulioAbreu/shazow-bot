import CommandDb, { GenericCommand } from "../models/generic-command";
import { asArray, Maybe } from "utils";
import { Source } from "../types";

export async function save(command: GenericCommand): Promise<GenericCommand> {
    const { name, output, serverId, source } = command;

    async function create(): Promise<GenericCommand> {
        return await CommandDb.create({
            serverId,
            source,
            name,
            output,
            createdAt: new Date(),
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
                serverId,
                source,
                output,
                createdAt: commandFromDB.createdAt,
            }
        ).lean();
    }

    const commandFromDB = await CommandDb.findOne({
        name,
        serverId,
        source,
    }).lean<GenericCommand>();
    if (!commandFromDB) {
        return create();
    } else {
        return updateExistent();
    }
}

export async function findAllById(
    commandSource: Source,
    commandServerId: string
): Promise<GenericCommand[]> {
    const genericCommands = await CommandDb.find({
        source: commandSource,
        serverId: commandServerId,
    });
    return asArray(genericCommands);
}

export async function findAll(): Promise<GenericCommand[]> {
    const genericCommands = await CommandDb.find().lean();
    return asArray(genericCommands);
}

export async function findOne(
    commandSource: Source,
    commandServerId: string,
    commandName: string
): Promise<Maybe<GenericCommand>> {
    const genericCommand = await CommandDb.findOne({
        name: commandName,
        serverId: commandServerId,
        source: commandSource,
    }).lean<Maybe<GenericCommand>>();
    return genericCommand ?? undefined;
}

export async function remove(
    commandSource: Source,
    commandServerId: string,
    commandName: string
): Promise<Maybe<GenericCommand>> {
    const operationResult = await CommandDb.findOneAndDelete({
        name: commandName,
        serverId: commandServerId,
        source: commandSource,
    }).lean<Maybe<GenericCommand>>();
    return operationResult ?? undefined;
}
