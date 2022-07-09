import * as yup from "yup";
import CommandLogDb, { CommandLog } from "../models/command-log";
import { Source } from "chat";

const CommandLogSchema = yup.object({
    author: yup.string().required("'author' field is required"),
    commandName: yup.string().required("'commandName' field is required"),
    message: yup.string().required("'message' field is required"),
    source: yup.string().required("'source' field is required"),
    serverId: yup.string().required("'serverId' field is required"),
});

export async function save(commandLog: CommandLog): Promise<boolean> {
    const isValid = await CommandLogSchema.isValid(commandLog);
    if (!isValid) {
        return false;
    }
    await CommandLogDb.create(commandLog);
    return true;
}

interface CountParameters {
    serverId: string;
    source: Source;
    commandName: string;
}

export async function count({ source, serverId, commandName }: CountParameters): Promise<number> {
    const commandLogs = await CommandLogDb.find({
        commandName,
        source: source,
        serverId,
    }).lean();
    return commandLogs.length;
}
