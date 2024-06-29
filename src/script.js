import './style.css';
import {getCurrentWeather} from "./weather";

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
        if (data.error) {
            console.log("Error in Default locaiton: "+ data.error);
            showModal("Sorry something went wrong. Please try again later");
        } else
            createWeatherDOM(data);
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


