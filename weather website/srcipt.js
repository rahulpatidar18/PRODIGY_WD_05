const apiKey = "05bad9d438849227854d57f68558714d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const searchBox = document.querySelector("#in");
const searchBtn = document.querySelector(".but");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
    const data = await response.json();

    if (response.status == 404) {
        displayError();
    } else {
        updateWeatherData(data);
    }
}

function displayError() {
    document.querySelector(".city").innerHTML = "";
    document.querySelector(".des").innerHTML = "";
    document.querySelector(".notfound").style.display = "block";
    document.querySelector(".down").style.display = "none";
    document.querySelector(".wind-down").style.display = "none";
    document.querySelector(".temp-down").style.display = "none";
}

function updateWeatherData(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".ex-wind").innerHTML = "Degree: " + data.wind.deg;
    document.querySelector(".ex-temp").innerHTML = "Feels like: " + data.main.feels_like + "°C";
    document.querySelector(".ex-pre").innerHTML = "Pressure: " + data.main.pressure;

    const weatherMain = data.weather[0].main;
    const weatherDescription = data.weather[0].description;

    updateWeatherIconAndBackground(weatherMain);
    document.querySelector(".des").innerHTML = weatherDescription;

    document.querySelector(".down").style.display = "block";
    document.querySelector(".temp-down").style.display = "block";
    document.querySelector(".wind-down").style.display = "block";
    document.querySelector(".notfound").style.display = "none";
}

function updateWeatherIconAndBackground(weatherMain) {
    const weatherConditions = {
        Clouds: { icon: "images/cloudy.png", background: "url(backimage/cloudy.jpg)" },
        Rain: { icon: "images/rainy.png", background: "url(backimage/rain.jpg)" },
        Mist: { icon: "images/smog.png", background: "url(backimage/somg.jpg)" },
        Smoke: { icon: "images/smog.png", background: "url(backimage/somg.jpg)" },
        Haze: { icon: "images/smog.png", background: "url(backimage/somg.jpg)" },
        Clear: { icon: "images/sun.png", background: "url(backimage/sunny.jpg)" },
        Drizzle: { icon: "images/rainy.png", background: "url(backimage/rain.jpg)" },
        Snow: { icon: "images/snow.png", background: "url(backimage/snow.jpg)" }
    };

    if (weatherConditions[weatherMain]) {
        weatherIcon.src = weatherConditions[weatherMain].icon;
        document.body.style.backgroundImage = weatherConditions[weatherMain].background;
    }
}

async function checkWeatherByCoordinates(lat, lon) {
    const response = await fetch(`${apiUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const data = await response.json();
    if (response.status === 200) {
        updateWeatherData(data);
    } else {
        displayError();
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                checkWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                displayError();
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        displayError();
    }
}

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const city = searchBox.value.trim();
    if (city) {
        checkWeather(city);
    }
});

// Get current location weather on page load
window.addEventListener("load", getCurrentLocationWeather);
