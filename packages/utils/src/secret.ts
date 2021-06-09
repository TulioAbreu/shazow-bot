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

interface Environment {
    DISCORD_TOKEN: string;
    MONGODB_CONNECTION_URL: string;
    TWITCH_USERNAME: string;
    TWITCH_TOKEN: string;
    PORT: number;
    WEATHER_API_KEY: string;
}

const SecretSchema = yup.object({
    DISCORD_TOKEN: yup.string().required("'DISCORD_TOKEN' env value is required"),
    MONGODB_CONNECTION_URL: yup.string().default("'MONGODB_CONNECTION_URL' env value is required"),
    TWITCH_USERNAME: yup.string().default("'TWITCH_USERNAME' env value is required"),
    TWITCH_TOKEN: yup.string().default("'TWITCH_TOKEN' env value is required"),
    PORT: yup.number().default(3001),
    WEATHER_API_KEY: yup.string().default("'WEATHER_API_KEY' env value is required"),
});

export function getSecret(): Secret {
    dotenv.config();
    const env = SecretSchema.validateSync(process.env);
    return getSecretFromEnv(env);
}

function getSecretFromEnv(env: Environment): Secret {
    return {
        discordToken: env.DISCORD_TOKEN,
        mongodbKey: env.MONGODB_CONNECTION_URL,
        twitchUsername: env.TWITCH_USERNAME,
        twitchToken: env.TWITCH_TOKEN,
        port: env.PORT,
        weatherApiKey: env.WEATHER_API_KEY,
    };
}
