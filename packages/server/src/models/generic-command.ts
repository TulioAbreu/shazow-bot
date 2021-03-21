import { Schema, model } from "mongoose";
import { GenericCommand } from "../controllers/generic-command";

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

export default model<GenericCommand>("Command", GenericCommandSchema);
