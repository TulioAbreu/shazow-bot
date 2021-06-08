/* eslint-disable camelcase */
import axios from "axios";
import { getSecret } from "utils/dist/secret";
import { createErrorResult, createResult, Maybe, Result } from "utils";
import { normalizeDiacritics, normalizeText } from "normalize-text";

const WEATHER_API_KEY: string = getSecret().weatherApiKey;
const WEATHER_API_ENDPOINT = "https://api.weatherapi.com/v1/forecast.json";

export interface Weather {
    location: string;
    maxTemperature: number;
    minTemperature: number;
    dayTemperature: number;
}

interface OpenWeatherPayload {
    location: OpenWeatherLocation;
    current: OpenWeatherCurrent;
    forecast: OpenWeatherForecast;
}

interface OpenWeatherLocation {
    name: string;
    region: string;
    country: string;
}

interface OpenWeatherCurrent {
    temp_c: number;
}

interface OpenWeatherForecast {
    forecastday: OpenWeatherForecastDay[];
}

interface OpenWeatherForecastDay {
    day: {
        maxtemp_c: number;
        mintemp_c: number;
    }
}

export async function fetchWeatherStatus(
    location: string
): Promise<Result<Weather>> {
    try {
        const response = await axios.get(WEATHER_API_ENDPOINT, {
            params: {
                key: WEATHER_API_KEY,
                days: 1,
                q: normalizeDiacritics(normalizeText(location)),
                aqi: "no",
                alerts: "no",
            },
        });
        const weather = parseWeatherData(response.data);
        if (!weather) {
            return createErrorResult("Empty response.");
        }
        return createResult(weather);
    } catch (error) {
        console.error(error);
        return createErrorResult(error);
    }
}

function parseWeatherData(payload: OpenWeatherPayload): Maybe<Weather> {
    const forecast = payload?.forecast.forecastday.shift();
    if (!payload || !forecast) {
        return;
    }

    return {
        location: formatOpenWeatherLocation(payload.location),
        dayTemperature: payload.current.temp_c,
        maxTemperature: forecast.day.maxtemp_c,
        minTemperature: forecast.day.mintemp_c,
    };
}

function formatOpenWeatherLocation(openWeatherLocation: OpenWeatherLocation): string {
    const { name, region, country } = openWeatherLocation;
    return `${name} / ${region} / ${country}`;
}
