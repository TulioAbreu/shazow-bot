import { asArray } from "utils";
import AnimeNewsChannelsDb, { AnimeNewsChannel } from "../models/anime-news-channels";

export async function findAll(): Promise<AnimeNewsChannel[]> {
    const animeNews = await AnimeNewsChannelsDb.find().lean();
    return asArray(animeNews);
}
