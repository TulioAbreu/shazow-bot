import { Chat, ChatClientID, DiscordClient } from "chat";
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

    const discordClient = chat.getClientByID(ChatClientID.Discord) as DiscordClient;
    for (const news of crunchyrollNews) {
        if (sentRecentNews.some((sentNews) => sentNews.newsId === getNewsId(news))) {
            continue;
        }

        const renderedNews = renderNews(news);
        for (const channelId of subscribedChannels) {
            // TODO: Handle errors
            discordClient.sendMessage(channelId, "", renderedNews);
        }

        await save({
            newsId: getNewsId(news),
            sentAt: new Date(),
        });
    }
}

function renderNews(news: CrunchyrollNews) {
    return {
        title: news.title,
        description: news.abstract,
        url: news.href,
        color: "#F78C25",
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
            }
        ]
    };
}

function getNewsId(news: CrunchyrollNews): string {
    return news.href;
}
