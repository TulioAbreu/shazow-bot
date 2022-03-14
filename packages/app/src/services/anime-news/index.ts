import axios from "axios";
import { load as cheerioLoad, Cheerio, Element } from "cheerio";
import { Maybe } from "utils/dist/result";

export interface CrunchyrollNews {
    title: string;
    href: string;
    abstract: string;
    postDate: string;
    imageUrl: string;
    short: string;
}

export async function scrapCrunchyrollNews(): Promise<Maybe<CrunchyrollNews[]>> {
    const pageHTML = await fetchCrunchyrollNewsPage();
    if (!pageHTML) {
        return undefined;
    }

    const news: CrunchyrollNews[] = [];

    const $ = cheerioLoad(pageHTML);
    $(".news-item").each((_index, newsItemChild) => {
        const newsItem = $(newsItemChild);

        news.push({
            title: getNewsItemTitle(newsItem),
            href: getNewsItemHref(newsItem),
            abstract: getNewsItemAbstract(newsItem),
            postDate: getNewsItemPostDate(newsItem),
            imageUrl: getNewsItemImageUrl(newsItem),
            short: getNewsItemShort(newsItem),
        });
    });

    return news;
}

function getNewsItemTitle(newsItem: Cheerio<Element>): string {
    const rawTitle = newsItem.find("h2 > a").text();
    return sanitizeText(rawTitle);
}

function getNewsItemHref(newsItem: Cheerio<Element>): string {
    const relativeHref = newsItem.find("h2 > a").attr("href") ?? "";
    return "https://www.crunchyroll.com" + relativeHref;
}

function getNewsItemAbstract(newsItem: Cheerio<Element>): string {
    return sanitizeText(newsItem.find("h3").text());
}

function getNewsItemPostDate(newsItem: Cheerio<Element>): string {
    return sanitizeText(newsItem.find(".post-date").text());
}

function getNewsItemImageUrl(newsItem: Cheerio<Element>): string {
    return newsItem.find(".mug").attr("src") ?? "";
}

function getNewsItemShort(newsItem: Cheerio<Element>): string {
    return sanitizeText(newsItem.find(".short").text());
}

function sanitizeText(title: string): string {
    return title.replace(/\s+/g, " ").trim();
}

async function fetchCrunchyrollNewsPage(): Promise<Maybe<string>> {
    const CRUNCHYROLL_NEWS_URL = "https://www.crunchyroll.com/pt-br/news";
    try {
        const response = await axios.get(CRUNCHYROLL_NEWS_URL);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}
