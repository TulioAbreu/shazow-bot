import * as yup from "yup";
import CommandLogDb, { CommandLog } from "../models/command-log";
import { ExecutableCommand } from "../command/type";

const CommandLogValidationSchema = yup.object().shape({
    author: yup.string().required(),
    commandName: yup.string().required(),
    message: yup.string().required(),
    source: yup.number().required(),
});

export async function saveCommandLog(command: ExecutableCommand): Promise<boolean> {
    const commandLog = {
        author: command.userName,
        commandName: command.name,
        message: command.message,
        source: command.source,
        sentAt: new Date(),
    } as CommandLog;

    if (!(await CommandLogValidationSchema.isValid(command))) {
        return false;
    }
    await CommandLogDb.create(commandLog);
    return true;
}
