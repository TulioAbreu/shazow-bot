import * as dotenv from "dotenv";
import * as yup from "yup";

export interface Secret {
    discordToken: string;
    twitchUsername: string;
    twitchToken: string;
    mongodbKey: string;
    port: number;
}

const SecretSchema = yup.object().shape({
    DISCORD_TOKEN: yup.string().required(),
    MONGODB_CONNECTION_URL: yup.string().required(),
    TWITCH_USERNAME: yup.string().required(),
    TWITCH_TOKEN: yup.string().required(),
    PORT: yup.number().required(),
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
    };
}
