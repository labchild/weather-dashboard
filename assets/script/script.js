const apiKey = '9eb608ca3fd28254d7792ab2bad5b46c';

var cityInput = $('#search-city');
var searchFormEl = $('#search-form');
var cityNameEl = $('#city-name');
var currentWeatherEl = $('#current-weather');
var forecastEl = $('#5-day-container');
var recentSearchesEl = $('#search-history');
var resultsEl = $('#results');

// convert city name to lat & lon
function cityAsLatLon(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    // call api for get lat & lon of city
    fetch(apiUrl).then(res => {
        if (res.ok) {
            res.json()
                // pass lat & lon from obj to get weather func
                .then(function (data) {
                    console.log(data);
                    console.log(data[0].lon, data[0].lat);
                    console.log();
                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    let cityName = data[0].local_names.en;
                    getWeatherData(lat, lon, cityName);
                })
        } else {
            alert("We didn't recognize that city. Please try again.");
        }
    }).catch(error => {
        alert("Unable to connect to the server");
    })
};

// cityAsLatLon('houston');

// get weather data
function getWeatherData(lat, lon, city) {
    // create api url based on user data
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;

    // call api – fetch()    
    fetch(apiUrl)
        .then(res => {
            // if response, then pass relevant data to print function save city name to storage
            if (res.ok) {
                res.json().then(data => {
                    console.log(data);
                    console.log(city);
                    let currentWeather = data.current;
                    let fiveDayWeather = data.daily;
                    console.log(currentWeather, fiveDayWeather);
                    printCurrentWeather(currentWeather, city);
                    printFutureWeather(fiveDayWeather, city);
                })
            }
            // else throw error message
            else {
                alert("We didn't recognize that city. Please try again.");

            }
            // catch error
        }).catch(error => console.log(error));
}

// print weather data
function printCurrentWeather(currentWeather, city) {
    
    // append heading to page
    // create today's date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    // create img for weather icon
    let icon = document.createElement('img');
    let iconUrl = 'https://openweathermap.org/img/w/' + currentWeather.weather[0].icon + '.png';
    $(icon).attr('src', iconUrl);
    
    // add city, date and icon to name h2
    cityNameEl.append(city + ' ' + today);
    cityNameEl.append(icon);

    // create p to hold weather data
    let temp = document.createElement('p');
    let wind = document.createElement('p');
    let humidity = document.createElement('p');
    let uv = document.createElement('p');
    let uvColorCode = document.createElement('span');

    temp.textContent = 'Temp: ' + currentWeather.temp + '°F';
    wind.textContent = 'Wind: ' + currentWeather.wind_speed + ' MPH';
    humidity.textContent = 'Humidity: ' + currentWeather.humidity + '%';

    uvColorCode.textContent = currentWeather.uvi;
    uv.textContent = 'UV Index: ';
    uv.append(uvColorCode);

    // add background image to uv index
    let uvIndex = currentWeather.uvi;
    if (uvIndex < 3) {
        uvColorCode.classList = 'btn bg-success bg-gradient text-white';
    }
    if (uvIndex >= 3 && uvIndex < 6) {
        uvColorCode.classList = 'btn bg-warning bg-gradient text-white';
    }
    if (uvIndex >= 6 && uvIndex < 8) {
        uvColorCode.classList = 'btn bg-orange bg-gradient text-white';
    }
    if (uvIndex >= 8) {
        uvColorCode.classList = 'btn bg-danger bg-gradient text-white';
    }
    
    // append weather data to current forecast div
    currentWeatherEl.addClass('border border-dark');
    currentWeatherEl.append(temp);
    currentWeatherEl.append(wind);
    currentWeatherEl.append(humidity);
    currentWeatherEl.append(uv);
}

function printFutureWeather(forecast, city) {
    // print data to five day forecast div
    forecastEl.html('<h3>5-Day Forecast:</h3>');
    console.log(forecast);
    // loop through 5 day to create cards
}
// get weather details from data obj
// key is bold, val is normal
// append to page in current-weather

// append to page in 5-day-container
// print button with city name to search-history and save in stored arr

// start the search (run in event listener)
function handleSearchClick(e) {
    if (e.target.matches('#search-btn')) {
        e.preventDefault();
        console.log('you clicked!');
        // get the user search term (city)
        let city = cityInput.val().trim();
        // pass to city coords func
        cityAsLatLon(city);
    }
}



// store city names
// get city names arr from storage on load to print
// if city names arr is empty, now it's new search term in arr
// else .push new term
// save to storage

/* LISTENERS */
// on load (print recent)
// if local storage, push to task arr

// listen for button click/new search
$(searchFormEl).on('click', '#search-btn', handleSearchClick);
// listen for recent search button click