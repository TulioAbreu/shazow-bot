import { Document, Schema, model } from "mongoose";

export interface NewsLog {
    newsId: string;
    sentAt?: Date;
}

interface INewsLog extends NewsLog, Document<string> {}

const NewsLogSchema = new Schema({
    newsId: { type: Schema.Types.String, required: true },
    sentAt: { type: Schema.Types.Date, required: true },
});

export default model<INewsLog>("NewsLog", NewsLogSchema);
