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
  console.log(response.data);
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

search("São Paulo");

let dateAndTime = document.querySelector("#current-time");
showCurrentDate(dateAndTime);

let searchCity = document.querySelector("#search-bar");
searchCity.addEventListener("submit", weatherBySearch);

let locationButton = document.querySelector("#location-info");
locationButton.addEventListener("click", getLocation);
