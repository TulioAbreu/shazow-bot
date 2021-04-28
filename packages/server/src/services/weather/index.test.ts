import { fetchWeatherStatus } from ".";

import axios from "axios";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Weather Service", () => {
    it("should parse weather data", async () => {
        mockedAxios.get.mockImplementationOnce(async () => ({
            data: {
                location: {
                    name: "belo horizonte",
                    region: "minas gerais",
                    country: "brasil",
                },
                current: { temp_c: 30 },
                forecast: {
                    forecastday: [{
                        day: {
                            maxtemp_c: 40,
                            mintemp_c: 10,
                        },
                    }],
                },
            },
        }));

        const weatherStatusResult = await fetchWeatherStatus("belo horizonte");
        expect(weatherStatusResult.hasValue).toBeTruthy();
        const weatherStatus = weatherStatusResult.value;
        expect(weatherStatus.location).toBe("belo horizonte / minas gerais / brasil");
        expect(weatherStatus.dayTemperature).toBe(30);
        expect(weatherStatus.maxTemperature).toBe(40);
        expect(weatherStatus.minTemperature).toBe(10);
    });

    describe("should return error result", () => {
        test("on empty response", async () => {
            mockedAxios.get.mockImplementationOnce(async () => ({
                data: undefined,
            }));

            const weatherStatusResult = await fetchWeatherStatus("bh");
            expect(weatherStatusResult.hasValue).toBeFalsy();
            expect(weatherStatusResult.errorMessage.length).toBeGreaterThan(0);
        });

        test("on not found error", async () => {
            mockedAxios.get.mockImplementationOnce(async () => {
                throw "404 error";
            });

            const weatherStatusResult = await fetchWeatherStatus("bh");
            expect(weatherStatusResult.hasValue).toBeFalsy();
            expect(weatherStatusResult.errorMessage.length).toBeGreaterThan(0);
        });
    });
});
