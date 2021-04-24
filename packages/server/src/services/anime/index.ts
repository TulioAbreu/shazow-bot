import axios from "axios";
import { createErrorResult, createResult, Result } from "../../utils/result";

export interface AnimeMedia {
    Media: {
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
}

const ANIME_QUERY =
`query($search: String) {
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
}`;

export async function fetchAnime(title: string): Promise<Result<AnimeMedia>> {
    if (!title) {
        return createErrorResult("Invalid name");
    }
    try {
        const response = await axios.post(
            "https://graphql.anilist.co/",
            {
                query: ANIME_QUERY,
                variables: {
                    search: title,
                },
            },
            {
                timeout: 3000,
            }
        );
        return createResult(response.data?.data);
    } catch (error) {
        return createErrorResult(error);
    }
}
