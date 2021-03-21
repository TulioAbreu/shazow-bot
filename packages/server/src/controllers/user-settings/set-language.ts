import { Language } from "../language/find-user-language";
import UserSettingsDb, { UserSettings } from "../../models/user-settings";
import { Source } from "chat";

export async function setUserSettingsLanguage(
    userId: string,
    platform: Source,
    language: Language
): Promise<UserSettings> {
    const updatedUserSettings = UserSettingsDb.updateOne(
        { userId, platform },
        { language }
    );
    return updatedUserSettings;
}
