import { Source } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import { Role } from "database/dist/types";

export function getUserRole(userSettings: UserSettings, platform: Source, serverId: string): Role {
    return userSettings.role?.[platform]?.[serverId] ?? Role.None;
}
