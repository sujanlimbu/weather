const WEATHER_API_KEY = "79605fd5f71e4c8787354519242606";
const BASE_URL = "https://api.weatherapi.com/v1";
const FORECAST_URL = `${BASE_URL}/forecast.json`;

export async function getWeatherForecast(location) {
    const url = `${FORECAST_URL}?q=${encodeURIComponent(location)}&key=${WEATHER_API_KEY}&days=7`;
    try {
        const response = await fetch(url, { mode: "cors" });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message);
        }
        const weather = await response.json();
        console.log(weather);
        return weather;
    } catch (error) {
        console.log("error:" + error.message);
        return { error: error.message };
    }
}

export function generateIconUrl(icon){
    return (location.protocol === 'https:' ? 'https:' : 'http:') + icon;
}