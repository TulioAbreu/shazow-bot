import { Document, Schema, model } from "mongoose";
import { Source } from "../types";

export interface CommandLog {
    message: string;
    author: string;
    sentAt: Date;
    serverId: string;
    source: Source;
    commandName: string;
}

interface ICommandLog extends CommandLog, Document {}

const CommandLogSchema = new Schema({
    message: {
        type: Schema.Types.String,
        required: true,
    },
    author: {
        type: Schema.Types.String,
        required: true,
    },
    sentAt: {
        type: Schema.Types.Date,
        required: true,
    },
    serverId: {
        type: Schema.Types.String,
        required: true,
    },
    source: {
        type: Schema.Types.String,
        required: true,
    },
    commandName: {
        type: Schema.Types.String,
        required: true,
    },
});

export default model<ICommandLog>("CommandLog", CommandLogSchema);
