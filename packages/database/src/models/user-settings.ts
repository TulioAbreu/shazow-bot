import { Document, Schema, model } from "mongoose";
import { Role } from "../types";
import { Source } from "chat";

export interface UserSettings {
    userId: string;
    platform: Source;
    role: Record<Source, SourceRoles>;
    language: string; // TODO: add types
    isIgnored: boolean;
}

type ServerId = string;

type SourceRoles = Record<ServerId, Role>;

export interface IUserSettings extends UserSettings, Document {}

const UserSettingsSchema = new Schema({
    userId: {
        type: Schema.Types.String,
        required: true,
    },
    platform: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.Mixed,
    },
    language: {
        type: Schema.Types.String,
        default: "en", // TODO: add types
        required: true,
    },
    isIgnored: {
        type: Schema.Types.Boolean,
        default: false,
        required: true,
    },
});

export default model<IUserSettings>("UserSetting", UserSettingsSchema);
