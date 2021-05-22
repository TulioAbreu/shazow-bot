import { Document, Schema, model } from "mongoose";

export interface Poll {
    _id?: string;
    question: string;
    options: string[];
    createdAt: Date;
    expiresAt: Date;
}

interface IPoll extends Poll, Document<string> {}

const PollSchema = new Schema({
    question: {
        type: Schema.Types.String,
        required: true,
    },
    options: [
        {
            type: Schema.Types.String,
        },
    ],
    createdAt: {
        type: Schema.Types.Date,
        required: true,
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true,
    },
});

export default model<IPoll>("Poll", PollSchema);
