import { Source } from "chat";
import { UserSettings } from "../../models/user-settings";
import { Role } from "../../types";
import { ExecutableCommand } from "../../command/type";
import { Language } from "../language/find-user-language";

const FAKE_USER_ID = "fakeUserId";
const FAKE_USER_NAME = "fakeUserName";

export function getFakeExecutableCommand(
    message: string,
    source: Source
): ExecutableCommand {
    const messageChunks = message.split(" ");
    return {
        message,
        name: messageChunks.shift(),
        arguments: messageChunks,
        source,
        userID: FAKE_USER_ID,
        userName: FAKE_USER_NAME,
    };
}

export function getFakeUserSettings(
    source: Source,
    role: Role,
    language: Language
): UserSettings {
    return {
        userId: FAKE_USER_ID,
        platform: source,
        role,
        language,
    } as UserSettings;
}
