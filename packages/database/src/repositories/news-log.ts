import NewsLogDb, { NewsLog } from "../models/news-log";

export async function getRecentNews(offset = 10): Promise<NewsLog[]> {
    return NewsLogDb
        .find({})
        .sort({ sentAt: -1 })
        .limit(offset).lean<NewsLog[]>() ?? [];
}

export async function save(newsLog: NewsLog): Promise<NewsLog> {
    return NewsLogDb.create({
        ...newsLog
    });
}
