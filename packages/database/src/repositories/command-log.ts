import * as yup from "yup";
import CommandLogDb, { CommandLog } from "../models/command-log";

const CommandLogSchema = yup.object().shape({
    author: yup.string().required(),
    commandName: yup.string().required(),
    message: yup.string().required(),
    source: yup.string().required(),
});

export async function save(commandLog: CommandLog): Promise<boolean> {
    const isValid = await CommandLogSchema.isValid(commandLog);
    if (!isValid) {
        return false;
    }
    await CommandLogDb.create(commandLog);
    return true;
}

export async function count(commandName: string): Promise<number> {
    const commandUsageCount = await CommandLogDb.count({ commandName });
    return commandUsageCount;
}
