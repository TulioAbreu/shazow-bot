import * as yup from "yup";
import { readFileSync } from "fs";

export interface Config {
    port: number;
    prefix: string;
    trollCommandThreshold: number;
    twitchChannels: string[];
}

const ConfigSchema = yup.object().shape({
    port: yup.number().required(),
    prefix: yup.string().required(),
    trollCommandThreshold: yup.number().default(100),
    twitchChannels: yup.array(yup.string()).notRequired(),
});

const CONFIG_FILEPATH = "./config.json";

function readConfig(): Config {
    const rawConfigFile = readFileSync(CONFIG_FILEPATH, "utf8");
    const parsedConfig = JSON.parse(rawConfigFile);
    return ConfigSchema.validateSync(parsedConfig);
}

export default readConfig();
