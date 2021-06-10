import * as yup from "yup";
import CommandLogDb, { CommandLog } from "../models/command-log";

const CommandLogSchema = yup.object({
    author: yup.string().required("'author' field is required"),
    commandName: yup.string().required("'commandName' field is required"),
    message: yup.string().required("'message' field is required"),
    source: yup.string().required("'source' field is required"),
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
    const commandLogs = await CommandLogDb.find({ commandName}).lean();
    return commandLogs.length;
}
