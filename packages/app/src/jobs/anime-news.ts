import { Chat, ChatClientID } from "chat";
import { CrunchyrollNews, scrapCrunchyrollNews } from "../services/anime-news";
import { getRecentNews, save } from "database/dist/repositories/news-log";

export async function animeNewsJob(chat: Chat): Promise<void> {
    console.log("INFO | Running animes job");

    const crunchyrollNews = await scrapCrunchyrollNews();
    if (!crunchyrollNews) {
        return;
    }

    const subscribedChannels = ["825855371859198054"]; // TODO: Move this to a database + command (or website) to register
    const sentRecentNews = await getRecentNews();

    for (const news of crunchyrollNews) {
        if (sentRecentNews.some((sentNews) => sentNews.newsId === getNewsId(news))) {
            continue;
        }

        for (const channelId of subscribedChannels) {
            chat.sendMessage(ChatClientID.Discord, channelId, news.title);
        }

        await save({
            newsId: getNewsId(news),
            sentAt: new Date(),
        });
    }
}

function getNewsId(news: CrunchyrollNews): string {
    return news.href;
}
