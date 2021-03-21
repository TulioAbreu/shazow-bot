import { OutputStr } from "../../languages";
import { Language } from "./find-user-language";

const DEFAULT_LANGUAGE = Language.English;

export function getOutput(
    language: Language,
    output: OutputStr,
    args?: string[]
): string {
    return applyArgs(output[language ?? DEFAULT_LANGUAGE], args);
}

function applyArgs(baseOutput: string, args: string[]): string {
    if (!Array.isArray(args)) {
        return baseOutput;
    }
    let newOutput: string = baseOutput;
    for (let i = 0; i < args.length; ++i) {
        newOutput = newOutput.replace(`%args${i}`, args[i]);
    }
    return newOutput;
}
