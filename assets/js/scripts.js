// Define the API key and retrieve elements from the DOM
const apiKey = "c13a92a964332cb069ba603e4eeb25bb";
const citySearch = document.getElementById("citySearch");
const searchForm = document.getElementById("searchForm");
const cityArray = JSON.parse(localStorage.getItem("cities")) || [];
const citySearches = document.getElementById("citySearches");

// Function to handle user input when submitting the form
function handleUserInput(event) {
  event.preventDefault();
  const city = citySearch.value.trim();
  if (!city) return;
  // Call functions to get current weather and forecast data
  getCurrentWeatherData(city);
  forecastData(city);
  citySearch.value = "";

}

function init() {
    cityArray.forEach(city => {
        const cityButton = document.createElement("button");
        cityButton.classList.add("cityButton");

        cityButton.textContent = city;

        citySearches.appendChild(cityButton);
    })
}
init()

function addCityButton(city) {
    console.log(city)
  if (!city) return;
  const cityButton = document.createElement("button");
  cityButton.classList.add("cityButton");

  cityButton.textContent = city;

  citySearches.prepend(cityButton);
  console.log(cityButton);
}


// Function to get current weather data for a given city
function getCurrentWeatherData(cityName) {
  // Construct the request URL for current weather data
  let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  // Fetch data from the API
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentData) {
        console.log(currentData);

      // Update local storage with city data if it doesn't already exist
        if (currentData.name) {
            renderCurrentWeatherCard(currentData);
            if (!cityArray.includes(currentData.name)) {
                console.log(currentData.name)
                cityArray.unshift(currentData.name);
                localStorage.setItem("cities", JSON.stringify(cityArray));
                addCityButton(currentData.name);
                
            }
        }
      // Render the current weather card
    })
    .catch(function (error) {
      alert("City not found");
    });
}

// Function to get forecast data for a given city
function forecastData(cityName) {
  // Construct the request URL for forecast data
  let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  // Fetch forecast data from the API
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (forecastData) {
        console.log(forecastData);
        renderForecastWeatherCards(forecastData)
    });

}

// Function to render the current weather card
function renderCurrentWeatherCard(currentData) {
  document.getElementById("currentWeatherContainer").innerHTML = "";
  // Create a div element for the weather card
  const currentWeatherCard = document.createElement("div");
  currentWeatherCard.classList.add("weather-card");

  // Extract relevant data from the API response
  const date = new Date(currentData.dt * 1000).toLocaleDateString();
  const icon = currentData.weather[0].icon;
  const temperature = currentData.main.temp;
  const humidity = currentData.main.humidity;
  const windSpeed = currentData.wind.speed;

  // Populate the weather card with data
  currentWeatherCard.innerHTML = `
    <h2>Today's Weather</h2>
    <h3>${currentData.name} ${date} <img id="wicon" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon"></h3>
    <p>Temperature: ${temperature}</p>
    <p>Humidity: ${humidity}</p>
    <p>Wind Speed: ${windSpeed}</p>
  `;

  // Append the weather card to the container in the DOM
  document
    .getElementById("currentWeatherContainer")
    .appendChild(currentWeatherCard);
}

// Function to render forecast weather cards
function renderForecastWeatherCards(forecastData) {
  document.getElementById("5dayWeatherContainer").innerHTML = "";

    // Iterate over forecast data and render cards for each forecast
    
  forecastData.list.forEach(function (forecast) {
    if (forecast.dt_txt.includes("03:00:00")) {
      const forecastWeatherCard = document.createElement("div");
      forecastWeatherCard.classList.add("forecast-card");
      forecastWeatherCard.setAttribute("style", "width: 18rem");

      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const icon = forecast.weather[0].icon;
      const temperature = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;

      forecastWeatherCard.innerHTML = `
        <h2>5 Day Forecast</h2>
        <h3>${date} <img id="wicon" src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon"></h3>
        <p>Temperature: ${temperature}</p>
        <p>Humidity: ${humidity}</p>
        <p>Wind Speed: ${windSpeed}</p>
      `;

      document
        .getElementById("5dayWeatherContainer")
        .appendChild(forecastWeatherCard);
    }
  });
}

// Add event listener to the search form
searchForm.addEventListener("submit", handleUserInput);


// Add event listener to city search container
citySearches.addEventListener("click", function(event) {
  // Check if the clicked element is a city button
  if (event.target.classList.contains('cityButton')) {
    // Get the city name from the button
    const cityName = event.target.textContent;
    // Call the function to render weather for the clicked city
      getCurrentWeatherData(cityName);
      forecastData(cityName)
  }
});


