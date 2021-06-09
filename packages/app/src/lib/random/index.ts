import { Action, createChatReply } from "chat";
import { Maybe } from "utils";
import { ExecutableCommand } from "../../services/command";

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 1000;
const HIGHER_NUMBER = 1000000;

export default function Random(command: ExecutableCommand): Action {
    let minValue = DEFAULT_MIN_VALUE;
    let maxValue = DEFAULT_MAX_VALUE;
    if (command.arguments?.length === 2) {
        const argMinValue = parseArgument(command.arguments[0]);
        const argMaxValue = parseArgument(command.arguments[1]);

        if (!!argMinValue && !!argMaxValue) {
            minValue = argMinValue;
            maxValue = argMaxValue;
        }
    }
    const value = randomIntFromInterval(minValue, maxValue);
    return createChatReply(`${value}`);
}

function parseArgument(arg: string): Maybe<number> {
    function limitValue(value: number): number {
        return value > HIGHER_NUMBER ? HIGHER_NUMBER : value;
    }

    const parsedInt = parseInt(arg);
    if (isNaN(parsedInt)) {
        return;
    }
    return limitValue(parsedInt);
}

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}
