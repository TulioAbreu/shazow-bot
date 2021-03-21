import { Source } from "chat";
import { Document, Schema, model } from "mongoose";

export interface Vote extends Document {
    _id?: string;
    pollId: string;
    username: string;
    userId: string;
    sentAt: Date;
    option: string;
    source: Source;
}

const VoteSchema = new Schema({
    pollId: {
        type: Schema.Types.String,
        required: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
    },
    userId: {
        type: Schema.Types.String,
        required: true,
    },
    sentAt: {
        type: Schema.Types.Date,
        required: true,
    },
    option: {
        type: Schema.Types.String,
        required: true,
    },
    source: {
        type: Schema.Types.Number,
        required: true,
    },
});

export default model<Vote>("Vote", VoteSchema);
