import { Action, ActionId, Source } from "chat";
import { ExecutableCommand } from "../../services/command";
import { Language, Output, getOutput } from "../../services/language";
import { UserSettings } from "../../models/user-settings";
import { isNullOrUndefined } from "../../utils/is-null-or-undefined";
import { AnimeMedia, fetchAnime } from "../../services/anime";

export default async function Anime(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    if (!command.arguments?.length) {
        return {
            id: ActionId.Reply,
            body: getOutput(
                Output.AnimeNoArguments,
                userSettings.language,
            ),
        };
    }
    const animeResult = await fetchAnime(command.arguments?.join(" "));
    if (!animeResult.hasValue) {
        return {
            id: ActionId.Reply,
            body: getOutput(Output.AnimeFetchFailed, userSettings.language, [
                animeResult.errorMessage,
            ]),
        };
    }
    const anime: AnimeMedia = animeResult.value;
    const outputRenderer = {
        [Source.Discord]: renderDiscordResponse,
        [Source.Twitch]: renderTwitchResponse,
    }[command.source] ?? renderTwitchResponse;
    return {
        id: ActionId.Reply,
        body: outputRenderer(anime, userSettings.language),
    };
}

function renderTwitchResponse(anime: AnimeMedia, language: Language): string {
    function renderTitle() {
        return anime.Media.title.romaji || anime.Media.title.english;
    }

    function renderYear() {
        return anime.Media.startDate.year?.toString() || "";
    }

    function renderGenres() {
        return `${anime.Media.genres.join(", ")}`;
    }

    function renderEpisodes(): string {
        const episodes = anime.Media.episodes;
        return episodes?.toString() || "";
    }

    function renderScore(): string {
        const score = anime.Media.averageScore;
        if (isNullOrUndefined(score)) {
            return "";
        }
        return (score / 10).toString();
    }

    return getOutput(Output.AnimeSuccessTwitch, language, [
        renderTitle(),
        renderYear(),
        renderGenres(),
        renderEpisodes(),
        renderScore(),
    ]);
}

function renderDiscordResponse(anime: AnimeMedia, language: Language): string {
    function renderTitle(): string {
        return `**${anime.Media.title.english || anime.Media.title.romaji}**`;
    }

    function renderGenres(): string {
        return `${anime.Media.genres.join(", ")}`;
    }

    function renderEpisodes(): string {
        const episodes = anime.Media.episodes;
        return episodes?.toString() || "";
    }

    function renderYear(): string {
        return anime.Media.startDate.year?.toString() || "";
    }

    function renderDescription(): string {
        return anime.Media.description.replace(/<[^>]*>/g, "");
    }

    function renderScore(): string {
        const score = anime.Media.averageScore;
        if (isNullOrUndefined(score)) {
            return "";
        }
        return (score / 10).toString();
    }

    function renderImage(): string {
        return anime.Media.coverImage.large;
    }

    return getOutput(Output.AnimeSuccessDiscord, language, [
        renderTitle(),
        renderYear(),
        renderGenres(),
        renderEpisodes(),
        renderDescription(),
        renderScore(),
        renderImage(),
    ]);
}