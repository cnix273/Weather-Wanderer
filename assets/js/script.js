// Getting the search elements
var searchBar = $("#search-bar");
var searchBtn = $("#search-btn");

//Getting today's forecast element
var today = $("#today");
var cityName = $("#name");
var cityTemp = $("#temperature");
var cityHumidity = $("#humidity");
var cityWind = $("#wind");
var cityUV = $("#uv");

var lat = "";
var lon = "";
var weather = "";

var weatherDesc = "";

// Getting the search history element
var searchHistory = $("#search-history");

// Local Storage of search history

var arrayIndex = parseInt(localStorage.getItem("arrayIndex")) || 0;

searchHistory.empty();

for (currentIndex = 0; currentIndex < arrayIndex; currentIndex++) {

var storedItem = localStorage.getItem(currentIndex);

var displayItem = $("<p onclick='searchHist(id)'>").text(storedItem).attr({"id": storedItem, "class": "card-text"});

searchHistory.append(displayItem, "<hr>");
};

//AJAX calls

// API Key
var apiKey = "0c850848d7da2a07b6d8e02351c5f0c6"

// Today's weather
function weatherToday(city, apiKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        // Get current date
        var now = moment();
        var dateDisplay = now.format('MM/DD/YYYY')
        
        cityName.text(response.name + " (" + dateDisplay + ") ");
        cityTemp.text("Temperature: " + ((response.main.temp).toFixed(2) + " \xB0F"));
        cityHumidity.text("Humidity: " + response.main.humidity + "%");
        cityWind.text("Wind Speed: " + response.wind.speed + " MPH");

        cityName.append($("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"));

        lat = response.coord.lat;
        lon = response.coord.lon;

        // UV index call
        weatherUvIndex(lat, lon, apiKey);

        // Search history

        var newItem = $("<p onclick='searchHist(id)'>").text(response.name).attr({"id": response.name, "class": "card-text"});

        searchHistory.append(newItem, "<hr>");

        localStorage.setItem(arrayIndex, response.name);
        arrayIndex++;
        localStorage.setItem("arrayIndex", arrayIndex);
    })
};

// UV index
function weatherUvIndex(lat, lon, apiKey) {
    var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response){
        // UV Number
        cityUV.text("UV Index: " + response.value);

        // UV Color
        var uvNum = parseInt(response.value);

        if (uvNum < 3) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: green");
        }
        if (uvNum >= 3 && uvNum < 6) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: yellow");
        }
        if (uvNum >= 6 && uvNum < 8) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: orange");
        }
        if (uvNum >= 8 && uvNum < 11) {
            cityUV.text("UV Index: " + response.value).attr("style", "background-color: red");
        }
        if (uvNum >= 11) {
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
        for (i=2;i<35;i+=8) {
            // Forecast date
            var dateArray = response.list[i].dt_txt.split('-');
            var newDate = dateArray[1] + "/" + dateArray[2][0] + dateArray[2][1] + "/" + dateArray[0]
            var date = $("<h5 class='forecast-text' id='forecast-date'>" + newDate + "</h5>")

            // Forecast icon
            var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
        
            // Forecast temperature
            var temp = $("<p>Temp: " + response.list[i].main.temp + " \xB0F</p>").attr("class", "forecast-text")

            // Forecast humidity
            var humidity = $("<p>Humidity: " + response.list[i].main.humidity + "%</p>").attr("class", "forecast-text")
            
            index = (i+6)/8;
            $("#day" + index).empty();
            $("#day" + index).append(date, img, temp, humidity);
        };
    })
};

// Search btn click event
searchBtn.on("click", function(event) {
    event.preventDefault();

    var city = searchBar.val();

    weatherToday(city, apiKey);
    weatherForecast(city, apiKey);
});

// Search history click event
function searchHist(id) {

    var city = id

    weatherToday(city, apiKey);
    weatherForecast(city, apiKey);

    localStorage.setItem(arrayIndex, city);
    arrayIndex++;
    localStorage.setItem("arrayIndex", arrayIndex);
};
