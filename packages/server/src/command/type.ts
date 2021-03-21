import { Source } from "chat";

export interface ExecutableCommand {
    userID: string;
    userName: string;
    name: string;
    message: string;
    arguments: string[];
    source: Source;
}
