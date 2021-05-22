import * as dotenv from "dotenv";
import * as yup from "yup";

export interface Secret {
    discordToken: string;
    twitchUsername: string;
    twitchToken: string;
    mongodbKey: string;
    port: number;
    weatherApiKey: string;
}

const SecretSchema = yup.object().shape({
    DISCORD_TOKEN: yup.string().default(""),
    MONGODB_CONNECTION_URL: yup.string().default(""),
    TWITCH_USERNAME: yup.string().default(""),
    TWITCH_TOKEN: yup.string().default(""),
    PORT: yup.number().default(3001),
    WEATHER_API_KEY: yup.string().default(""),
});

export function getSecret(): Secret {
    dotenv.config();
    const env = SecretSchema.validateSync(process.env);
    return {
        discordToken: env.DISCORD_TOKEN,
        mongodbKey: env.MONGODB_CONNECTION_URL,
        twitchUsername: env.TWITCH_USERNAME,
        twitchToken: env.TWITCH_TOKEN,
        port: env.PORT,
        weatherApiKey: env.WEATHER_API_KEY,
    };
}