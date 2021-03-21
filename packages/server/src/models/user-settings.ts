import { Source } from "chat";
import { Document, Schema, model } from "mongoose";
import { Language } from "../controllers/language/find-user-language";
import { Role } from "../types";

export interface UserSettings {
    userId: string;
    platform: Source;
    role: Role;
    language: Language;
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
        default: Language.English,
        required: true,
    },
});

export default model<IUserSettings>("UserSetting", UserSettingsSchema);
