import { Language } from "../language/find-user-language";
import { Role } from "../../types";
import UserSettingsDb, { UserSettings } from "../../models/user-settings";
import { Source } from "chat";

export async function createUserSettings(
    userId: string,
    platform: Source
): Promise<UserSettings> {
    const DEFAULT_LANGUAGE = Language.English;
    const DEFAULT_ROLE = Role.None;
    const createdUser = await UserSettingsDb.create({
        userId,
        platform,
        language: DEFAULT_LANGUAGE,
        role: DEFAULT_ROLE,
    });
    return createdUser;
}
