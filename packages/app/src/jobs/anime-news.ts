import { Chat, ChatClientID, DiscordClient } from "chat";
import { CrunchyrollNews, scrapCrunchyrollNews } from "../services/anime-news";
import { getRecentNews, save as saveNewsLog } from "database/dist/repositories/news-log";
import { findAll as findAllAnimeNewsChannels } from "database/dist/repositories/anime-news-channels";

export async function animeNewsJob(chat: Chat): Promise<void> {
    console.log("INFO | Running animes job");

    const crunchyrollNews = await scrapCrunchyrollNews();
    if (!crunchyrollNews) {
        return;
    }

    const subscribedChannels = await findAllAnimeNewsChannels();
    const sentRecentNews = await getRecentNews();

    const discordClient = chat.getClientByID(ChatClientID.Discord) as DiscordClient;
    for (const news of crunchyrollNews) {
        if (sentRecentNews.some((sentNews) => sentNews.newsId === getNewsId(news))) {
            continue;
        }

        const renderedNews = renderNews(news);
        for (const subscribedChannel of subscribedChannels) {
            // TODO: Handle errors
            discordClient.sendMessage(subscribedChannel.id, "", renderedNews);
        }

        await saveNewsLog({
            newsId: getNewsId(news),
            sentAt: new Date(),
        });
    }
}

function renderNews(news: CrunchyrollNews) {
    const CRUNCHYROLL_PRIMARY_COLOR = "#F78C25";
    return {
        title: news.title,
        description: news.abstract,
        url: news.href,
        color: CRUNCHYROLL_PRIMARY_COLOR,
        image: {
            url: news.imageUrl,
        },
        fields: [
            {
                name: "Preview",
                value: news.short,
            },
            {
                name: "Data",
                value: news.postDate,
            },
        ],
    };
}

function getNewsId(news: CrunchyrollNews): string {
    return news.href;
}
