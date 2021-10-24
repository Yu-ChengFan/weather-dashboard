let apiKey = "a9f8d0e7222922643c1e1fb8aa83d99b";
let searchFormEl = document.querySelector("#search-form");
let cityInputEl = document.querySelector("#city-search");
let currentWeatherEl = document.querySelector("#current-weather");
let clearButtonEl = document.querySelector("#clear-btn");
let searchistoryEl = document.querySelector("#search-history");
let errorEl = document.querySelector("#error-text");
let temp = document.querySelector("#temp")
let wind = document.querySelector("#wind")
let humid = document.querySelector("#humid")
let uv = document.querySelector("#uv")
let search = JSON.parse(localStorage.getItem("search") || "[]");

let submitSearch = function(event){
    event.preventDefault();
    let cityName = cityInputEl.value.trim();
    if (cityName){
        getInfo(cityName);
    } else {
        errorEl.innerHTML = "Please enter a valid city"
        return;
    }
};

let getWeather = function(lat,lon){
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(apiURL)
    .then(function(res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function(data){
        displayWeather(data);
        displayForecast(data);
    })
};

let getInfo = function(cityName){
    let apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    fetch(apiURL)
        .then(function(res) {
            errorEl.innerhtml = ""
            return res.json();
        })
        .then(function(data){
            let lat = (data[0].lat);
            let lon = (data[0].lon);
            getWeather(lat, lon);
        })
        .catch(function(error){
            errorEl.innerHTML = "Please enter a valid city"
        })
};

let displayForecast = function(data) {
    for (i = 1; i < 6; i++) {
        let current = document.querySelector("#card" + i + "-title")
        current.textContent = moment().add(i, 'd').format("M/D/YYYY");
    }
    for (index = 1; index < 6; index++) {
        let currentData = data.daily[index]
        let iconLink = "https://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png"
        let icon = document.querySelector("#card" + index + "-icon");
        icon.src = iconLink
        let temp = document.querySelector("#card" + index + "-temp")
        temp.innerHTML = "Temp: " + currentData.temp.day + " \u00B0F"
        let wind = document.querySelector("#card" + index + "-wind")
        wind.innerHTML = "Wind: " + currentData.wind_speed + " MPH"
        let humid = document.querySelector("#card" + index + "-humid")
        humid.innerHTML = "Humidity: " + currentData.humidity + " %"
    }
};

let displayWeather = function(data){
    let apiUrl = "https://api.openweathermap.org/geo/1.0/reverse?lat=" + data.lat + "&lon=" + data.lon + "&limit=1&appid=" + apiKey
    let iconLink = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
    fetch(apiUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            currentWeatherEl.innerHTML = data[0].name + " (" + moment().format("M/D/YYYY") + ") ";
            currentWeatherEl.appendChild(document.createElement("img")).src = iconLink
            saveSearch(data[0].name)
        })
    temp.textContent = "Temp: " + data.current.temp + " \u00B0F"
    wind.textContent = "Wind: " + data.current.wind_speed + " MPH"
    humid.textContent = "Humidity: " + data.current.humidity + " %"
    if (data.current.uvi < 2) {
        uv.innerHTML = "UV Index: " + "<span class='uvi-low'>" + data.current.uvi + "</span>"
    } else if (data.current.uvi < 5) {
        uv.innerHTML = "UV Index: " + "<span class='uvi-mid'>" + data.current.uvi + "</span>"
    } else if (data.current.uvi < 7) {
        uv.innerHTML = "UV Index: " + "<span class='uvi-high'>" + data.current.uvi + "</span>"
    } else {
        uv.innerHTML = "UV Index: " + "<span class='uvi-extreme'>" + data.current.uvi + "</span>"
    }
};

let saveSearch = function(cityName) {
    if (search.includes(cityName)) {
        return;
    } else {
        search.push(cityName)
        localStorage.setItem("search", JSON.stringify(search));
        loadSearch();
    }
};

let loadSearch = function() {
    if (search.length > 0) {
        searchistoryEl.innerHTML = "";
        for (i = 0; i < search.length; i++) {
            let searchBtn = document.createElement("button")
            searchBtn.className = "w-100 m-0 mb-2"
            searchBtn.textContent = search[i]
            searchistoryEl.appendChild(searchBtn);
        }
    } else {
        searchistoryEl.innerHTML = "";
    }
};

let clearHistory = function() {
    search = [];
    localStorage.clear();
    loadSearch();
};

let history = function(event) {
    if (event.target.innerHTML.includes("<")) {
        return;
    } else {
        console.log(event.target.innerHTML)
        getInfo(event.target.innerHTML)
    }
};

loadSearch();
searchFormEl.addEventListener("submit", submitSearch);
clearButtonEl.addEventListener("click", clearHistory);
searchistoryEl.addEventListener("click", history);