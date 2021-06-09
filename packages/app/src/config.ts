import { readFileSync } from "fs";
import * as yup from "yup";

export interface Config {
    readonly port: number;
    readonly prefix: string;
    readonly trollCommandThreshold: number;
    readonly twitchChannels: string[];
}

const ConfigSchema = yup.object({
    port: yup.number().required("'port' field is required"),
    prefix: yup.string().required("'prefix' field is required"),
    trollCommandThreshold: yup.number().default(100),
    twitchChannels: yup
        .array(yup.string().required())
        .required("'twitchChannels' field is required"),
});

const CONFIG_FILEPATH = "./config.json";
const CONFIG = readConfigFile(CONFIG_FILEPATH);

export function getConfig(): Config {
    return CONFIG;
}

function readConfigFile(filepath: string): Config {
    const fileContent = readFileSync(filepath, "utf8");
    const rawConfig = JSON.parse(fileContent);
    ConfigSchema.validateSync(rawConfig);
    return parseRawConfig(rawConfig);
}

function parseRawConfig(rawConfig: Config): Config {
    const { port, prefix, trollCommandThreshold, twitchChannels } = rawConfig;
    return {
        port,
        prefix,
        trollCommandThreshold,
        twitchChannels,
    };
}
