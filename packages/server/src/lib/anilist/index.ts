import axios from "axios";
import { Action, ActionId, Source } from "chat";
import gql from "graphql-tag";
import { ExecutableCommand } from "../../command/type";
import { Language } from "../../controllers/language/find-user-language";
import { getOutput } from "../../controllers/language/get-user-output";
import { Output } from "../../languages";
import { UserSettings } from "../../models/user-settings";
import { isNullOrUndefined } from "../../utils/is-null-or-undefined";
import { createErrorResult, createResult, Result } from "../../utils/result";

const ANIME_QUERY = gql`
    query($search: String) {
        Media(search: $search, type: ANIME) {
            title {
                english
                romaji
            }
            coverImage {
                large
            }
            startDate {
                year
            }
            description
            episodes
            chapters
            genres
            averageScore
        }
    }
`;

interface AnilistAnime {
    Media: AnimeMedia;
}

interface AnimeMedia {
    title: {
        english: string;
        romaji: string;
    };
    coverImage: {
        large: string;
    };
    startDate: {
        year: number;
    };
    description: string;
    episodes: number | null;
    genres: string[];
    averageScore: number;
}

export default async function Anime(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Anime.NoArguments),
        };
    }

    const animeResult = await retrieveAnime(command.arguments.join(" "));
    if (!animeResult.hasValue) {
        return {
            id: ActionId.Reply,
            body: getOutput(userSettings.language, Output.Anime.FetchFailed, [
                animeResult.errorMessage,
            ]),
        };
    }

    const anime = animeResult.value;
    let outputMessage = "";
    switch (command.source) {
        case Source.Discord:
            outputMessage = renderDiscordResponse(
                anime.Media,
                userSettings.language
            );
            break;
        case Source.Twitch:
            outputMessage = renderTwitchResponse(
                anime.Media,
                userSettings.language
            );
            break;
        default: {
            outputMessage = renderTwitchResponse(
                anime.Media,
                userSettings.language
            );
        }
    }
    return {
        id: ActionId.Reply,
        body: outputMessage,
    };
}

async function retrieveAnime(name: string): Promise<Result<AnilistAnime>> {
    if (!name) {
        return createErrorResult("Empty anime name");
    }
    try {
        const response = await axios.post(
            "https://graphql.anilist.co/",
            {
                query: ANIME_QUERY,
                variables: {
                    search: name,
                },
            },
            {
                timeout: 3000,
            }
        );
        return createResult(response.data);
    } catch (error) {
        // TODO: Log error
        return createErrorResult(error);
    }
}

function renderTwitchResponse(media: AnimeMedia, language: Language): string {
    function renderTitle() {
        return media.title.romaji || media.title.english;
    }

    function renderYear() {
        return media.startDate.year?.toString() || "";
    }

    function renderGenres() {
        return `${media.genres.join(", ")}`;
    }

    function renderEpisodes(): string {
        const episodes = media.episodes;
        return episodes?.toString() || "";
    }

    function renderScore(): string {
        const score = media.averageScore;
        if (isNullOrUndefined(score)) {
            return "";
        }
        return (score / 10).toString();
    }

    return getOutput(language, Output.Anime.SuccessTwitch, [
        renderTitle(),
        renderYear(),
        renderGenres(),
        renderEpisodes(),
        renderScore(),
    ]);
}

function renderDiscordResponse(media: AnimeMedia, language: Language): string {
    function renderTitle(): string {
        return `**${media.title.english || media.title.romaji}**`;
    }

    function renderGenres(): string {
        return `${media.genres.join(", ")}`;
    }

    function renderEpisodes(): string {
        const episodes = media.episodes;
        return episodes?.toString() || "";
    }

    function renderYear(): string {
        return media.startDate.year?.toString() || "";
    }

    function renderDescription(): string {
        return media.description.replace(/<[^>]*>/g, "");
    }

    function renderScore(): string {
        const score = media.averageScore;
        if (isNullOrUndefined(score)) {
            return "";
        }
        return (score / 10).toString();
    }

    function renderImage(): string {
        return media.coverImage.large;
    }

    return getOutput(language, Output.Anime.SuccessDiscord, [
        renderTitle(),
        renderYear(),
        renderGenres(),
        renderEpisodes(),
        renderDescription(),
        renderScore(),
        renderImage(),
    ]);
}
