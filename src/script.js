import './style.css';
import { getWeatherForecast, generateIconUrl } from "./weather";
import {getHourAmPm, getDaysName} from "./datetimeUtil";

document.addEventListener("DOMContentLoaded", () => {
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherOtherInfoDiv = document.getElementById("weather-other-info");
    const dayForecastInfoDiv = document.getElementById("day-forecast-info");
    const weekForecastInfoDiv = document.getElementById("week-forecast-info");

    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const closeButton = document.querySelector(".close-button");

    const searchForm = document.querySelector(".search-form");
    searchForm.addEventListener("submit", searchWeather);

    async function searchWeather(event) {
        event.preventDefault();

        const formData = new FormData(searchForm);
        const keyword = formData.get("keyword");
        const weather = await getWeatherForecast(keyword);
        if (weather.error) {
            showModal(weather.error);
        } else{
            createWeatherInfoDOM(weather);
            createWeatherOtherInfoDOM(weather)
            createDayForecaseInfoDOM(weather);
            createWeekForecaseInfoDOM(weather);
        }
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

    getWeatherForecast("sydney").then(data => {
        if (data.error) {
            console.log("Error for default location: " + data.error);
            showModal("Sorry something went wrong. Please try again later");
        } else {
            createWeatherInfoDOM(data);
            createWeatherOtherInfoDOM(data)
            createDayForecaseInfoDOM(data);
            createWeekForecaseInfoDOM(data);
        }
    });

    function createWeatherInfoDOM(data) {
        weatherInfoDiv.innerHTML = "";
        const headingLocation = document.createElement("h2");
        headingLocation.textContent = data.location.name + ", " + data.location.country;
        weatherInfoDiv.appendChild(headingLocation);

        const headingCondition = document.createElement("h4");
        headingCondition.textContent = data.current.condition.text;
        weatherInfoDiv.appendChild(headingCondition);

        const conditionIcon = document.createElement("img");
        conditionIcon.src = generateIconUrl(data.current.condition.icon);
        weatherInfoDiv.appendChild(conditionIcon);

        const currentTemp = document.createElement("h1");
        currentTemp.textContent = data.current.temp_c + "°C";
        weatherInfoDiv.appendChild(currentTemp);

        const maxMinTemp = document.createElement("p");
        maxMinTemp.textContent = `High: ${data.forecast.forecastday[0].day.maxtemp_c}°C, Low: ${data.forecast.forecastday[0].day.mintemp_c}°C`;
        weatherInfoDiv.appendChild(maxMinTemp);

        const lastUpdated = document.createElement("p");
        lastUpdated.textContent = "Last updated: " + data.current.last_updated;
        weatherInfoDiv.appendChild(lastUpdated);
    }

    function createWeatherOtherInfoDOM(data) {
        weatherOtherInfoDiv.innerHTML = "";
        const sunrise = document.createElement("p");
        sunrise.textContent = `Sunrise: ${data.forecast.forecastday[0].astro.sunrise}`;
        weatherOtherInfoDiv.appendChild(sunrise);

        const sunset = document.createElement("p");
        sunset.textContent = `Sunset: ${data.forecast.forecastday[0].astro.sunset}`;
        weatherOtherInfoDiv.appendChild(sunset);

        const moonrise = document.createElement("p");
        moonrise.textContent = `Moonrise: ${data.forecast.forecastday[0].astro.moonrise}`;
        weatherOtherInfoDiv.appendChild(moonrise);

        const moonset = document.createElement("p");
        moonset.textContent = `Moonset: ${data.forecast.forecastday[0].astro.moonset}`;
        weatherOtherInfoDiv.appendChild(moonset);
    }

    function createDayForecaseInfoDOM(data) {
        dayForecastInfoDiv.innerHTML = "";
        const dayForecast = data.forecast.forecastday[0].hour;

        dayForecast.forEach(eachHour => {
            const div = document.createElement("div");
            const time = document.createElement("p");
            time.textContent = `${getHourAmPm(eachHour.time)}`;
            div.appendChild(time);

            const temp = document.createElement("h4");
            temp.textContent = `${eachHour.temp_c}°C`;
            div.appendChild(temp);

            const conditionIcon = document.createElement("img");
            conditionIcon.classList.add("mini-condition-icon");
            conditionIcon.src = generateIconUrl(eachHour.condition.icon);
            div.appendChild(conditionIcon);

            const condition = document.createElement("p");
            condition.textContent = `${eachHour.condition.text}`;
            div.appendChild(condition);

            dayForecastInfoDiv.appendChild(div);
        });
    }

    function createWeekForecaseInfoDOM(data) {
        weekForecastInfoDiv.innerHTML = "";
        const weekForecast = data.forecast.forecastday;

        weekForecast.forEach(eachDay => {
            const div = document.createElement("div");

            const eachDayElem = document.createElement("p");
            eachDayElem.textContent = `${getDaysName(eachDay.date)}: L ${eachDay.day.mintemp_c}°C, H ${eachDay.day.maxtemp_c}°C (${eachDay.day.condition.text})`;

            const conditionIcon = document.createElement("img");
            conditionIcon.classList.add("mini-condition-icon");
            conditionIcon.src = generateIconUrl(eachDay.day.condition.icon);
            eachDayElem.appendChild(conditionIcon);

            div.appendChild(eachDayElem);
            weekForecastInfoDiv.appendChild(div);
        });
    }
});


