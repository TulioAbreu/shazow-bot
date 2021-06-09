import { Action, ChatClient, createChatReply } from "chat";
import type { UserSettings } from "database/dist/models/user-settings";
import { ExecutableCommand } from "../../services/command";
import { getOutput, Language, Output } from "../../services/language";

export default async function Help(
    _client: ChatClient,
    _command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    return createChatReply(getOutput(Output.Help, userSettings.language as Language));
}
