import { Maybe } from "utils";
import { Source } from "chat";

export enum Role {
    None = "none",
    Trusted = "trusted",
    Admin = "admin",
}

export function parseSource(rawSourceStr: string): Maybe<Source> {
    const sourceStr = rawSourceStr.trim().toLowerCase();
    switch (sourceStr) {
        case "discord":
            return Source.Discord;
        case "twitch":
            return Source.Twitch;
    }
}
