function updateIcon(iconElement, icon, description) {
  const icons = {
    "01d": "clear-sky-day.svg",
    "01n": "clear-sky-night.svg",
    "02d": "few-clouds-day.svg",
    "02n": "few-clouds-night.svg",
    "03d": "scattered-clouds.svg",
    "03n": "scattered-clouds.svg",
    "04d": "broken-clouds.svg",
    "04n": "broken-clouds.svg",
    "09d": "shower-rain.svg",
    "09n": "shower-rain.svg",
    "10d": "rain-day.svg",
    "10n": "rain-night.svg",
    "11d": "thunderstorm.svg",
    "11n": "thunderstorm.svg",
    "13d": "snow.svg",
    "13n": "snow.svg",
    "50d": "mist-day.svg",
    "50n": "mist-night.svg",
  };

  iconElement.setAttribute("alt", description);

  iconElement.setAttribute("src", `images/icons/${icons[icon]}`);
}

function showCurrentDate(element) {
  let currentDate = new Date();

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = weekDays[currentDate.getDay()];
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let message = (element.innerHTML = `${day}, ${hours}:${minutes}`);
  return message;
}

function formatForecastDay(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let forecastDay = forecastDate.getDay();
  let forecastAllDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return forecastAllDays[forecastDay];
}

function addForecastInfo(dailyForecast) {
  let container = document.querySelector("#weather-forecast");
  let template = document.querySelector("#weather-forecast-template");

  let forecastItem = template.cloneNode(true);
  forecastItem.id = "";
  forecastItem.classList.remove("d-none");

  updateIcon(
    forecastItem.querySelector(".forecast-icon"),
    dailyForecast.weather[0].icon,
    dailyForecast.weather[0].description
  );

  forecastItem.querySelector(".forecast-day").innerHTML = formatForecastDay(
    dailyForecast.dt
  );

  forecastItem.querySelector(".forecast-description").innerHTML =
    dailyForecast.weather[0].main;

  let forecastMax = forecastItem.querySelector(".forecast-maximum-temperature");
  forecastMax.dataset.celsiusTemperature =
    Math.round(dailyForecast.temp.max) + "º";
  forecastMax.dataset.fahrenheitTemperature =
    Math.round((dailyForecast.temp.max * 9) / 5 + 32) + "º";
  forecastMax.innerHTML = forecastMax.dataset.celsiusTemperature;

  let forecastMin = forecastItem.querySelector(".forecast-minimum-temperature");
  forecastMin.dataset.celsiusTemperature =
    Math.round(dailyForecast.temp.min) + "º";
  forecastMin.dataset.fahrenheitTemperature =
    Math.round((dailyForecast.temp.min * 9) / 5 + 32) + "º";
  forecastMin.innerHTML = forecastMin.dataset.celsiusTemperature;

  container.appendChild(forecastItem);
}

function clearForecast() {
  let container = document.querySelector("#weather-forecast");
  let forecastItems = container.querySelectorAll(".weather-forecast-item");

  forecastItems.forEach((forecastItem) => {
    if (forecastItem.id == "") {
      container.removeChild(forecastItem);
    }
  });
}

function updateForecast(response) {
  let forecast = response.data.daily.slice(1, -1);

  clearForecast();
  forecast.forEach(addForecastInfo);
}

function showForecast(coordinates) {
  let apiKey = "0213a5bacb9c127e38e1f86fb2b9741b";
  let unit = "metric";
  let forecastEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly,minutely&units=${unit}&appid=${apiKey}`;
  axios.get(forecastEndpoint).then(updateForecast);
}

function updateWeather(response) {
  let cityName = document.querySelector("#city");
  cityName.innerHTML = response.data.name;

  let temperature = document.querySelector("#temperature");
  temperature.dataset.celsiusTemperature = Math.round(response.data.main.temp);
  temperature.dataset.fahrenheitTemperature = Math.round(
    (temperature.dataset.celsiusTemperature * 9) / 5 + 32
  );
  temperature.innerHTML = temperature.dataset.celsiusTemperature;

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let feelsLike = document.querySelector("#weather-feels");
  feelsLike.dataset.celsiusTemperature = `${Math.round(
    response.data.main.feels_like
  )}º`;

  feelsLike.dataset.fahrenheitTemperature = `${Math.round(
    (response.data.main.feels_like * 9) / 5 + 32
  )}º`;

  feelsLike.innerHTML = feelsLike.dataset.celsiusTemperature;

  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}%`;

  updateIcon(
    document.querySelector("#weather-icon"),
    response.data.weather[0].icon,
    response.data.weather[0].description
  );

  showForecast(response.data.coord);

  disableAndEnableButtons(fahrenheitUnit, celsiusUnit);
}

function search(city) {
  let apiKey = "0213a5bacb9c127e38e1f86fb2b9741b";
  let unit = "metric";
  let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(endpoint).then(updateWeather);
}

function weatherBySearch(event) {
  event.preventDefault();
  let citySearch = document.querySelector("#city-input");
  let cityValue = `${citySearch.value}`;
  search(cityValue);
}

function showTemperatureByLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let unit = "metric";
  let apiKey = "0213a5bacb9c127e38e1f86fb2b9741b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

  axios.get(apiUrl).then(updateWeather);
}

function getLocation(event) {
  navigator.geolocation.getCurrentPosition(showTemperatureByLocation);
}

function disableAndEnableButtons(toEnable, toDisable) {
  toEnable.classList.remove("btn-primary");
  toEnable.classList.add("btn-outline-primary");
  toDisable.classList.remove("btn-outline-primary");
  toDisable.classList.add("btn-primary");
}

function convertFahrenheitUnit(event) {
  event.preventDefault();

  disableAndEnableButtons(celsiusUnit, fahrenheitUnit);

  let elements = document.querySelectorAll("[data-celsius-temperature]");
  elements.forEach((element) => {
    element.innerHTML = element.dataset.fahrenheitTemperature;
  });
}

function convertCelsiusUnit(event) {
  event.preventDefault();

  disableAndEnableButtons(fahrenheitUnit, celsiusUnit);

  let elements = document.querySelectorAll("[data-celsius-temperature]");
  elements.forEach((element) => {
    element.innerHTML = element.dataset.celsiusTemperature;
  });
}

function reloadPage() {
  search("São Paulo");
}

// let celsiusTemperature = null;

let celsiusUnit = document.querySelector("#celsius-button");
celsiusUnit.addEventListener("click", convertCelsiusUnit);

let fahrenheitUnit = document.querySelector("#fahrenheit-button");
fahrenheitUnit.addEventListener("click", convertFahrenheitUnit);

let dateAndTime = document.querySelector("#current-time");
showCurrentDate(dateAndTime);

let searchCity = document.querySelector("#search-bar");
searchCity.addEventListener("submit", weatherBySearch);

let locationButton = document.querySelector("#location-info");
locationButton.addEventListener("click", getLocation);

let logo = document.querySelector("#logo");
logo.addEventListener("click", reloadPage);

search("São Paulo");
