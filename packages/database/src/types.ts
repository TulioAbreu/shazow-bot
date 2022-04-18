import { Maybe } from "utils";

export enum Role {
    None = 0,
    Trusted = 1,
    Admin = 2,
}

export enum Source {
    Discord = 0,
    Twitch = 1,
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
