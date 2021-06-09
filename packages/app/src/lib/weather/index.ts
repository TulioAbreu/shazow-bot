import { Action, ChatClient, createChatReply } from "chat";
import { UserSettings } from "database/dist/models/user-settings";
import { ExecutableCommand } from "../../services/command";
import { getOutput, Language, Output } from "../../services/language";
import { fetchWeatherStatus } from "../../services/weather";

export default async function Weather(
    _client: ChatClient,
    command: ExecutableCommand,
    userSettings: UserSettings,
): Promise<Action> {
    const location = command.arguments?.join(" ");
    if (!location) {
        return createChatReply(
            getOutput(Output.WeatherInvalidArgs, userSettings.language as Language)
        );
    }
    const weatherResult = await fetchWeatherStatus(location);
    if (!weatherResult.hasValue()) {
        return createChatReply(getOutput(Output.WeatherFail, userSettings.language as Language));
    }
    const weather = weatherResult.unwrap();
    return createChatReply(
        getOutput(Output.WeatherSuccess, userSettings.language as Language, [
            weather.location,
            weather.dayTemperature?.toString() ?? "??",
            weather.minTemperature?.toString() ?? "??",
            weather.maxTemperature?.toString() ?? "??",
        ])
    );
}
