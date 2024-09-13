const API_KEY = 'bd5b230e3904862fd96c0fb5c8ed775f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const searchInput = document.querySelector('.search');
const searchIcon = document.querySelector('.search-icon');
const tempToggle = document.querySelector('.switch input');
const tempSpan = document.querySelector('.temp');
const minMaxTempSpan = document.querySelector('.min-max-temp');
const locationSpan = document.querySelector('.location span');
const currentWeatherSection = document.querySelector('.current-weather');
const highlightCards = document.querySelector('.highlight-cards');
const forecastCards = document.querySelector('.forecast-cards');

let isCelsius = true;
const defaultLocation = 'New York, US';

function updateTheme() {
    const themeClass = isCelsius ? 'celsius-theme' : 'fahrenheit-theme';
    document.body.className = themeClass;
}

searchIcon.addEventListener('click', () => {
    const location = searchInput.value.trim();
    if (location) {
        fetchWeatherData(location);
    }
});

tempToggle.addEventListener('change', () => {
    isCelsius = !isCelsius;
    const location = searchInput.value.trim() || defaultLocation;
    fetchWeatherData(location);
    updateTheme();
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value.trim();
        if (location) {
            fetchWeatherData(location);
        }
    }
});

function fetchWeatherData(location) {
    const url = `${BASE_URL}weather?q=${location}&appid=${API_KEY}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateCurrentWeather(data);
            fetchForecastData(location);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchForecastData(location) {
    const url = `${BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=${isCelsius ? 'metric' : 'imperial'}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function updateCurrentWeather(data) {
    const { name, sys, main, weather, wind, visibility } = data;
    const temp = Math.round(main.temp);
    const minTemp = Math.round(main.temp_min);
    const maxTemp = Math.round(main.temp_max);
    const weatherDesc = weather[0].description;

    const locationString = `${name}, ${sys.country}`;

    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', options);

    locationSpan.textContent = locationString;
    tempSpan.textContent = `${temp}°${isCelsius ? 'C' : 'F'}`;
    minMaxTempSpan.textContent = `/${minTemp}°${isCelsius ? 'C' : 'F'} - ${maxTemp}°${isCelsius ? 'C' : 'F'}`;

    currentWeatherSection.querySelector('h2').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
    currentWeatherSection.querySelector('p').textContent = currentDate;

    const weatherIconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;
    currentWeatherSection.querySelector('.temperature img').src = weatherIconUrl;
    currentWeatherSection.querySelector('p:last-child').textContent = weatherDesc;

    const windStatus = `${wind.speed} km/h`;
    highlightCards.querySelector('.card:nth-child(1) h4').textContent = windStatus;
    highlightCards.querySelector('.card:nth-child(1) p:last-child').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const humidityStatus = `${main.humidity}%`;
    highlightCards.querySelector('.card:nth-child(2) h4').textContent = humidityStatus;
    highlightCards.querySelector('.card:nth-child(2) p:last-child').textContent = main.humidity > 70 ? "High Humidity" : "Humidity is good";

    const uvIndex = "4 UV";
    highlightCards.querySelector('.card:nth-child(3) h4').textContent = uvIndex;
    highlightCards.querySelector('.card:nth-child(3) p:last-child').textContent = "Moderate UV";

    const visibilityStatus = `${visibility / 1000} km`;
    highlightCards.querySelector('.card:nth-child(4) h4').textContent = visibilityStatus;
    highlightCards.querySelector('.card:nth-child(4) p:last-child').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    highlightCards.querySelector('.card:nth-child(5) h4').textContent = new Date(sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    highlightCards.querySelector('.card:nth-child(6) h4').textContent = new Date(sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function updateForecast(data) {
    forecastCards.innerHTML = '';
    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    forecastList.forEach(forecast => {
        const day = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;

        const forecastCard = `
            <div class="forecast-card">
                <p>${day}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                <p>${temp}°${isCelsius ? 'C' : 'F'}</p>
            </div>
        `;

        forecastCards.insertAdjacentHTML('beforeend', forecastCard);
    });
}

fetchWeatherData(defaultLocation);
