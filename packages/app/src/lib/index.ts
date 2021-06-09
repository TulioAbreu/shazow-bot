import Ping from "./ping";
import Pong from "./pong";
import Random from "./random";
import Anilist from "./anilist";
import Poll from "./poll";
import Vote from "./vote";
import Settings from "./user-settings";
import PollStatus from "./poll-status";
import CreateCommand from "./create-command";
import DeleteCommand from "./delete-command";
import Weather from "./weather";
import Help from "./help";
import { Action, ChatClient } from "chat";
import { ExecutableCommand } from "../services/command";
import { UserSettings } from "database/dist/models/user-settings";

type NativeCommand = (
    client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings,
) => Promise<Action> | Action;
type NativeCommandsMap = Readonly<Map<string, NativeCommand>>;

function mountNativeCommandsMap(): NativeCommandsMap {
    const map = new Map<string, NativeCommand>();
    map.set("ping", Ping);
    map.set("pong", Pong);
    map.set("random", Random);
    map.set("anime", Anilist);
    map.set("poll", Poll);
    map.set("vote", Vote);
    map.set("pollStatus", PollStatus);
    map.set("settings", Settings);
    map.set("createCommand", CreateCommand);
    map.set("deleteCommand", DeleteCommand);
    map.set("weather", Weather);
    map.set("help", Help);
    return map;
}

export const nativeCommandsMap = mountNativeCommandsMap();
