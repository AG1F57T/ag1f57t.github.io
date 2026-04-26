const btnWeather = document.getElementById('btn-weather');
const weatherDisplay = document.getElementById('weather-display');
const cityInput = document.getElementById('city-input');
const weatherForecastDisplay = document.getElementById('weather-forecast-display');

function getWeather() {
    const city = cityInput.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},PL&appid=a37bbb872e0002e4f2c6b37c2d4d9cfe&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            weatherDisplay.innerHTML = `
                <div id="weather-card">
                    <p>Pogoda dla<strong> ${result.name}</strong></p>
                    <p><strong>Temperatura:</strong> ${result.main.temp}°C</p>
                    <p><strong>Odczuwalna temperatura:</strong> ${result.main.feels_like}°C</p>
                    <p><strong>Prędkość wiatru:</strong> ${result.wind.speed}km/h</p>
                    <p><strong>Zachmurzenie:</strong> ${result.weather[0].description}</p>
                </div>            
                `;
            console.log(result);
        } else {
            weatherDisplay.innerHTML = `Error`;
        }
    };

    xhr.send();
}

async function getWeatherForecast() {
    const city = cityInput.value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},PL&appid=a37bbb872e0002e4f2c6b37c2d4d9cfe&units=metric&lang=pl`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        let forecastHTML = `<h2>Prognoza pogody dla <strong>${result.city.name}</strong></h2>`;

        result.list.forEach((forecast) => {
            forecastHTML += `
                <div id="weather-forecast-card">
                    <p>${forecast.dt_txt}</p>
                    <p><strong>Temperatura:</strong> ${forecast.main.temp}°C</p>
                    <p><strong>Odczuwalna temperatura:</strong> ${forecast.main.feels_like}°C</p>
                    <p><strong>Prędkość wiatru:</strong> ${forecast.wind.speed} km/h</p>
                    <p><strong>Zachmurzenie:</strong> ${forecast.weather[0].description}</p>
                    <p><strong>Wilgotność:</strong> ${forecast.main.humidity}%</p>
                </div>            
                `;
        });

        weatherForecastDisplay.innerHTML = forecastHTML;
        console.log(result);
    } catch (error) {
        weatherForecastDisplay.innerHTML = `Error`;
    }
}

btnWeather.addEventListener('click', () => {
    getWeather();
    getWeatherForecast();
});
