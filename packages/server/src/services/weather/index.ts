/* eslint-disable camelcase */
import axios from "axios";
import { getSecret } from "../../secret";
import { createErrorResult, createResult, Result } from "../../utils/result";
import { normalizeDiacritics, normalizeText } from "normalize-text";

const WEATHER_API_KEY: string = getSecret().weatherApiKey;

export interface Weather {
    location: string;
    maxTemperature: number;
    minTemperature: number;
    dayTemperature: number;
}

interface OpenWeatherPayload {
    location: {
        name: string;
        region: string;
        country: string;
    }
    current: {
        temp_c: number;
    }
    forecast: {
        forecastday: {
            day: {
                maxtemp_c: number;
                mintemp_c: number;
            }
        }[];
    };
}

export async function fetchWeatherStatus(location: string): Promise<Result<Weather>> {
    const endpoint = getWeatherApiEndpoint();
    try {
        const response = await axios.get(endpoint, {
            params: {
                key: WEATHER_API_KEY,
                days: 1,
                q: normalizeDiacritics(normalizeText(location)),
                aqi: "no",
                alerts: "no",
            }
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

function parseWeatherData(payload: OpenWeatherPayload): Weather {
    if (!payload) { return; }
    const forecast = payload.forecast.forecastday.shift();
    return {
        location: `${payload.location.name} / ${payload.location.region} / ${payload.location.country}`,
        dayTemperature: payload.current.temp_c,
        maxTemperature: forecast?.day?.maxtemp_c,
        minTemperature: forecast?.day?.mintemp_c,
    };
}

function getWeatherApiEndpoint(): string {
    return "https://api.weatherapi.com/v1/forecast.json";
}
