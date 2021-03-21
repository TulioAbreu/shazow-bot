import { Document } from "mongoose";

export interface GenericCommand extends Document {
    name: string;
    output: string;
    createdAt: Date;
    isCacheable: boolean;
}
