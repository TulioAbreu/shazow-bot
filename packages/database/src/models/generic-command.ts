import { Document, Schema, model } from "mongoose";
import { Source } from "chat";

export interface GenericCommand {
    name: string;
    output: string;
    createdAt: Date;
    source: Source;
    serverId: string;
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
    source: {
        type: Schema.Types.String,
        required: true,
    },
    serverId: {
        type: Schema.Types.String,
        required: true,
    },
});

export default model<IGenericCommand>("Command", GenericCommandSchema);
