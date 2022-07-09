import { Source } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import { Role } from "database/dist/types";
import { Maybe } from "utils";

export function getUserRole(userSettings: UserSettings, platform: Source, serverId: string): Maybe<Role> {
    return userSettings.role?.[platform]?.[serverId];
}
