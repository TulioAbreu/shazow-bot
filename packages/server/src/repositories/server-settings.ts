import { Source } from "chat";
import ServerSettingsDb, { ServerSettings } from "../models/server-settings";

const DEFAULT_PREFIX = "$";

export async function findOne(
    serverId: string,
    platform: Source,
): Promise<ServerSettings> {
    return ServerSettingsDb.findOne({
        serverId, platform
    });
}

export async function create(
    serverSettings: ServerSettings
): Promise<ServerSettings> {
    if (!serverSettings) {
        return;
    }
    const {
        serverId,
        platform,
        prefix = DEFAULT_PREFIX,
    } = serverSettings;
    if (!serverId || !platform) {
        return;
    }
    return ServerSettingsDb.create({
        serverId,
        platform,
        prefix,
    });
}
