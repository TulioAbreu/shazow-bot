import { Source } from "chat";
import { Document, Schema, model } from "mongoose";

export interface CommandLog extends Document {
    message: string;
    author: string;
    sentAt: Date;
    source: Source;
    commandName: string;
}

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
    source: {
        type: Schema.Types.String,
        required: true,
    },
    commandName: {
        type: Schema.Types.String,
        required: true,
    },
});

export default model<CommandLog>("CommandLog", CommandLogSchema);
