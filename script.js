const apiKey = "02f877d706c1a01dd5d1538286b133d0";

const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");
const searchInput = document.getElementById("searchInput");
const weatherDisplay = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecastContainer");

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(null, latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function fetchWeather(city, lat, lon) {
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }

  const response = await fetch(url);
  const data = await response.json();
  if (data.cod === 200) {
    displayCurrentWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } else {
    alert(data.message);
  }
}

async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  displayForecast(data.list);
}

function displayCurrentWeather(data) {
  const { name, main, weather, wind } = data;
  document.getElementById("cityName").textContent = `${name}`;
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
  document.getElementById("currentTemp").textContent = `Temperature: ${main.temp}°C`;
  document.getElementById("currentDetails").textContent = `Wind: ${wind.speed} M/S, Humidity: ${main.humidity}%`;
  document.getElementById("weatherCondition").textContent = weather[0].description;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

  weatherDisplay.classList.remove("hidden");
}

function displayForecast(forecastList) {
  forecastContainer.innerHTML = "";
  const filteredForecasts = forecastList.filter((item, index) => index % 8 === 0);

  filteredForecasts.forEach((forecast) => {
    const { dt_txt, main, weather } = forecast;
    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card", "p-4", "rounded-lg", "shadow-md", "text-center");
    forecastCard.innerHTML = `
      <p>${dt_txt.split(" ")[0]}</p>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="Icon" class="mx-auto mb-2">
      <p>Temp: ${main.temp}°C</p>
      <p>Wind: ${forecast.wind.speed} M/S</p>
      <p>Humidity: ${main.humidity}%</p>
    `;
    forecastContainer.appendChild(forecastCard);
  });
}
