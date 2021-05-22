import { Document, Schema, model } from "mongoose";
import { Role, Source } from "../types";

export interface UserSettings {
    userId: string;
    platform: Source;
    role: Role;
    language: string; // TODO: add types
    isIgnored: boolean;
}

export interface IUserSettings extends UserSettings, Document {}

const UserSettingsSchema = new Schema({
    userId: {
        type: Schema.Types.String,
        required: true,
    },
    platform: {
        type: Schema.Types.Number,
        required: true,
    },
    role: {
        type: Schema.Types.Number,
        default: Role.None,
        required: true,
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
