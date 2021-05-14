import { Action, createChatReply } from "chat";
import { UserSettings } from "../../models/user-settings";
import { ExecutableCommand } from "../../services/command";
import { getOutput, Output } from "../../services/language";
import { fetchWeatherStatus } from "../../services/weather";

export default async function Weather(
    command: ExecutableCommand,
    userSettings: UserSettings
): Promise<Action> {
    const location = command.arguments?.join(" ");
    if (!location) {
        return createChatReply(
            getOutput(Output.WeatherInvalidArgs, userSettings.language)
        );
    }
    const weatherResult = await fetchWeatherStatus(location);
    if (!weatherResult.hasValue) {
        return createChatReply(
            getOutput(Output.WeatherFail, userSettings.language)
        );
    }
    const weather = weatherResult.value;
    return createChatReply(
        getOutput(Output.WeatherSuccess, userSettings.language, [
            weather.location,
            weather.dayTemperature?.toString() ?? "??",
            weather.minTemperature?.toString() ?? "??",
            weather.maxTemperature?.toString() ?? "??",
        ])
    );
}
