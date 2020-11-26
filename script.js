// Getting the search elements
var searchBar = $("#search-bar");
var searchBtn = $("#search-btn");

//Getting today's forecast element
var today = $("#today");
var cityName = $("#name");
var cityTemp = $("#temp");
var cityHumidity = $("#humidity");
var cityWind = $("#wind");
var cityUV = $("#uv");

var lat = "";
var lon = "";
var weather = "";

var weatherDesc = "";

// Getting the search history element


// API Key
var apiKey = "0c850848d7da2a07b6d8e02351c5f0c6"

//AJAX calls

// Today's weather
function weatherToday(city, apiKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        
        cityName.text(response.name);
        cityTemp.text("Temperature: " + ((response.main.temp).toFixed(2) + "\xB0C"));
        cityHumidity.text("Humidity: " + response.main.humidity + "%");
        cityWind.text("Wind Speed: " + response.wind.speed + " MPH");
        // cityUV.text("UV Index: " + response)

        lat = response.coord.lat;
        lon = response.coord.lon;

        weatherUvIndex(lat, lon, apiKey);
    })
};

// UV index
function weatherUvIndex(lat, lon, apiKey) {
    var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response){
        
        cityUV.text("UV Index: " + response.value);
        if (response.value < 3) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: green");
        }
        if (response.value >= 3 || response.value < 6) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: yellow");
        }
        if (response.value >= 6 || response.value < 8) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: orange");
        }
        if (response.value >= 8 || response.value < 11) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: red");
        }
        if (response.value >= 11) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: purple");
        }
    });
};

// 5-day forecast
function weatherForecast(city, apiKey) {
    var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response){
        console.log(response);
        
        // Forecast date
        for (i=5;i<38;i+=8) {
        var date = $("<h5 class='card-title'>" + response.list[i].dt_txt + "</h5>")

        console.log(response.list[i].dt_txt);
        var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
        // var icon = $("<img src='http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png>");

        // // Forecast icon
        // if (response.list[i].weather[0].description == "clear sky") {
        //     var icon = $("<i class='fas fa-sun'></i>")
        // }
        // if (response.list[i].weather[0].description == "few clouds") {
        //     var icon = $("<i class='fas fa-cloud-sun'></i>")
        // }
        // if (response.list[i].weather[0].description == "scattered clouds") {
        //     var icon = $("<i class='fas fa-cloud'></i>")
        // }
        // if (response.list[i].weather[0].description == "broken clouds") {
        //     var icon = $("<i class='fas fa-cloud'></i>")
        // }
        // if (response.list[i].weather[0].description == "shower rain") {
        //     var icon = $("<i class='fas fa-cloud-showers-heavy'></i>")
        // }
        // if (response.list[i].weather[0].description == "rain") {
        //     var icon = $("<i class='fas fa-cloud-rain'></i>")
        // }
        // if (response.list[i].weather[0].description == "thunderstorm") {
        //     var icon = $("<i class='fas fa-bolt'></i>")
        // }
        // if (response.list[i].weather[0].description == "snow") {
        //     var icon = $("<i class='far fa-snowflake'></i>")
        // }
        // if (response.list[i].weather[0].description == "mist") {
        //     var icon = $("<i class='fas fa-smog'></i>")
        // }

        var temp = $("<p>Temp: " + response.list[i].main.temp + "</p>")
        var humidity = $("<p>Humidity: " + response.list[i].main.humidity + "%</p>")

        index = (i+3)/8;
        $("#day" + index).append(date, img, temp, humidity);
        
        };
    })
};

searchBtn.on("click", function(event) {
    event.preventDefault();

    var city = searchBar.val();

    weatherToday(city, apiKey);
    weatherForecast(city, apiKey);
});