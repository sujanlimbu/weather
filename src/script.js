const WEATHER_API_KEY = "79605fd5f71e4c8787354519242606";
const BASE_URL = "https://api.weatherapi.com/v1";
const FORECAST_URL = `${BASE_URL}/forecast.json`;

document.addEventListener("DOMContentLoaded", () => {
    const weatherInfoDiv = document.getElementById("weather-info");

    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const closeButton = document.querySelector(".close-button");

    const searchForm = document.querySelector(".search-form");
    searchForm.addEventListener("submit", searchWeather);

    async function searchWeather(event) {
        event.preventDefault();

        const formData = new FormData(searchForm);
        const keyword = formData.get("keyword");
        const weather = await getCurrentWeather(keyword);
        if (weather.error) {
            showModal(weather.error);
        } else
            createWeatherDOM(weather);
    }

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
    }

    closeButton.addEventListener("click", closeModal);

    function closeModal() {
        modal.style.display = "none";
    }

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    getCurrentWeather("sydney").then(data => {
        createWeatherDOM(data);
    }).catch(error => {
        console.log(error);
    });

    function createWeatherDOM(data) {
        weatherInfoDiv.innerHTML = "";
        const headingLocation = document.createElement("h3");
        headingLocation.textContent = data.location.name + ", " + data.location.country;
        weatherInfoDiv.appendChild(headingLocation);

        const headingCondition = document.createElement("h4");
        headingCondition.textContent = data.current.condition.text;
        weatherInfoDiv.appendChild(headingCondition);

        const conditionIcon = document.createElement("img");
        conditionIcon.src = (location.protocol === 'https:' ? 'https:' : 'http:') + data.current.condition.icon;
        weatherInfoDiv.appendChild(conditionIcon);

        const currentTemp = document.createElement("h1");
        currentTemp.textContent = data.current.temp_c + "°C";
        weatherInfoDiv.appendChild(currentTemp);

        const maxMinTemp = document.createElement("h4");
        maxMinTemp.textContent = `High: ${data.forecast.forecastday[0].day.maxtemp_c}°C Low: ${data.forecast.forecastday[0].day.mintemp_c}°C`;
        weatherInfoDiv.appendChild(maxMinTemp);

        const lastUpdated = document.createElement("h5");
        lastUpdated.textContent = "Last updated: " + data.current.last_updated;
        weatherInfoDiv.appendChild(lastUpdated);
    }

});

async function getCurrentWeather(location) {
    const url = `${FORECAST_URL}?q=${encodeURIComponent(location)}&key=${WEATHER_API_KEY}&days=1`;
    try {
        const response = await fetch(url, { mode: "cors" });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message);
        }
        const weather = await response.json();
        return weather;
    } catch (error) {
        console.log("error:" + error.message);
        return { error: error.message };
    }
}
