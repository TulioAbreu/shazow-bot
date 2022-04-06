import { model, Schema } from "mongoose";

export interface AnimeNewsChannel {
    id: string;
}

interface IAnimeNewsChannel extends AnimeNewsChannel, Document {}

const AnimeNewsChannelSchema = new Schema({
    id: {
        type: Schema.Types.String,
        required: true,
    }
});

export default model<IAnimeNewsChannel>("AnimeNewsChannel", AnimeNewsChannelSchema);
