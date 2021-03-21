import { Document, Schema, model } from "mongoose";

export interface Poll extends Document {
    _id?: string;
    question: string;
    options: string[];
    createdAt: Date;
    expiresAt: Date;
}

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

export default model<Poll>("Poll", PollSchema);
