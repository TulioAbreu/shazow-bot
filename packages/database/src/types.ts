import { Maybe } from "utils";

export enum Role {
    None = "none",
    Trusted = "trusted",
    Admin = "admin",
}

export enum Source {
    Discord = "discord",
    Twitch = "twitch",
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
