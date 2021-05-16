import { Source } from "chat";
import { Document, Schema, model } from "mongoose";

export interface ServerSettings{
    serverId: string;
    platform: Source;
    prefix: string;
}

interface IServerSettings extends ServerSettings, Document<string> {}

const ServerSettingSchema = new Schema({
    serverId: {
        type: Schema.Types.String,
        required: true,
    },
    platform: {
        type: Schema.Types.Number,
        required: true,
    },
    prefix: {
        type: Schema.Types.String,
        required: true,
    },
});

export default model<IServerSettings>("ServerSettings", ServerSettingSchema);
