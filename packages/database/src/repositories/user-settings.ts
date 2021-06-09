import { Role, Source } from "../types";
import UserSettingsDb, { UserSettings } from "../models/user-settings";
import { Maybe } from "utils";

export async function create(userId: string, platform: Source): Promise<UserSettings> {
    const DEFAULT_LANGUAGE = "en"; // TODO: add types
    const DEFAULT_ROLE = Role.None;

    const createdUser = await UserSettingsDb.create({
        userId,
        platform,
        language: DEFAULT_LANGUAGE,
        role: DEFAULT_ROLE,
        isIgnored: false,
    });
    return createdUser;
}

export async function findOne(userId: string, platform: Source): Promise<Maybe<UserSettings>> {
    const userSettings = await UserSettingsDb.findOne({ userId, platform }).lean<UserSettings>();
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
