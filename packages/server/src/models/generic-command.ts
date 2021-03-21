import { Document, Schema, model } from "mongoose";

export interface GenericCommand {
    name: string;
    output: string;
    createdAt: Date;
    isCacheable: boolean;
}

interface IGenericCommand extends GenericCommand, Document {}

const GenericCommandSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    output: {
        type: Schema.Types.String,
        required: true,
    },
    // TODO: Add "createdBy" field
    // TODO: Create counter commands
    createdAt: {
        type: Schema.Types.Date,
        required: true,
    },
});

export default model<IGenericCommand>("Command", GenericCommandSchema);
