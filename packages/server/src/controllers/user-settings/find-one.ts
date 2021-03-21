import { Source } from "chat";
import UserSettingsDb, { UserSettings } from "../../models/user-settings";

export async function findOneUserSettings(
    userId: string,
    platform: Source
): Promise<UserSettings> {
    const userSettings = UserSettingsDb.findOne({
        userId: userId,
        platform: platform,
    });
    return userSettings ? userSettings : undefined;
}
