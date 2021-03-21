import CommandDb, { GenericCommand } from "../../models/generic-command";

export async function createGenericCommand(
    command: GenericCommand
): Promise<GenericCommand> {
    let result: GenericCommand;
    const { name, output, isCacheable } = command;

    async function create() {
        result = await CommandDb.create({
            name,
            output,
            isCacheable,
            createdAt: new Date(),
        });
    }

    async function updateExistent() {
        result = await CommandDb.updateOne(
            {
                name,
            },
            {
                name,
                output,
                isCacheable: commandFromDB["isCacheable"],
                createAt: commandFromDB["createdAt"],
            }
        ).lean();
    }

    const commandFromDB = await CommandDb.findOne({ name });
    if (!commandFromDB) {
        create();
    } else {
        updateExistent();
    }
    return result;
}
