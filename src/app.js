function updateIcon(icon, description) {
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

  let iconElement = document.querySelector("#weather-icon");
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

function updateWeather(response) {
  let cityName = document.querySelector("#city");
  cityName.innerHTML = response.data.name;

  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.main.temp);

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let feelsLike = document.querySelector("#weather-feels");
  feelsLike.innerHTML = `${Math.round(response.data.main.feels_like)}º`;

  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.main.humidity)}%`;

  updateIcon(
    response.data.weather[0].icon,
    response.data.weather[0].description
  );

  celsiusTemperature = Math.round(response.data.main.temp);
}

function addForecastInfo() {
  let container = document.querySelector("#weather-forecast");
  let template = document.querySelector("#weather-forecast-template");

  let forecastItem = template.cloneNode(true);
  forecastItem.id = "";
  forecastItem.classList.remove("d-none");
  container.appendChild(forecastItem);
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

function enableAndDisableButtons(buttonA, buttonB) {
  buttonA.classList.remove("btn-primary");
  buttonA.classList.add("btn-outline-primary");
  buttonB.classList.remove("btn-outline-primary");
  buttonB.classList.add("btn-primary");
}

function convertFahrenheitUnit(event) {
  event.preventDefault();

  enableAndDisableButtons(celsiusUnit, fahrenheitUnit);

  let fahrenheitTemperature = document.querySelector("#temperature");
  fahrenheitTemperature.innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
}

function convertCelsiusUnit(event) {
  event.preventDefault();

  enableAndDisableButtons(fahrenheitUnit, celsiusUnit);

  let celsius = document.querySelector("#temperature");
  celsius.innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;

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

search("São Paulo");
