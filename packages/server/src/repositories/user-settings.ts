import { Source } from "chat";
import { Language } from "../services/language";
import { Role } from "../types";
import UserSettingsDb, { UserSettings } from "../models/user-settings";

export async function create(
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

export async function findOne(
    userId: string,
    platform: Source
): Promise<UserSettings> {
    const userSettings = UserSettingsDb.findOne({
        userId,
        platform,
    });
    return userSettings ?? undefined;
}

export async function update(
    userId: string,
    platform: Source,
    userSettings: Partial<UserSettings>
): Promise<boolean> {
    const updatedUserSettings = await UserSettingsDb.updateOne(
        { userId, platform },
        userSettings
    ).lean();
    return updatedUserSettings.nModified === 1;
}
