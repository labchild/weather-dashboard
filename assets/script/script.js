const apiKey = '9eb608ca3fd28254d7792ab2bad5b46c';

var cityInput = $('#search-city');
var searchFormEl = $('#search-form');
var cityNameEl = $('#city-name');
var currentWeatherEl = $('#current-weather');
var forecastEl = $('#5-day-container');
var recentSearchesEl = $('#recent-btn-grp');
var recentSearchArr;


// convert city name to lat & lon
function cityAsLatLon(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    // call api for get lat & lon of city
    fetch(apiUrl).then(res => {
        if (res.ok) {
            res.json()
                // pass lat & lon from obj to get weather func
                .then(function (data) {

                    let lat = data[0].lat;
                    let lon = data[0].lon;
                    let cityName = data[0].name;
                    getWeatherData(lat, lon, cityName);
                    saveSearchTerm(lat, lon, cityName);
                })
        } else {
            alert("We didn't recognize that city. Please try again.");
        }
    }).catch(error => {
        console.log(error);
        alert('Something went wrong!');
    })
};

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
                    let currentWeather = data.current;
                    let fiveDayWeather = data.daily;

                    // print weather
                    printCurrentWeather(currentWeather, city);
                    printFutureWeather(fiveDayWeather);

                })
            }
            // else throw error message
            else {
                alert("We didn't recognize that city. Please try again.");

            }
            // catch error
        }).catch(error => {
            console.log(error);
            alert('Something went wrong!');
        });
}

// print weather data
function printCurrentWeather(currentWeather, city) {
    cityNameEl.empty();
    currentWeatherEl.empty();
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

function printFutureWeather(forecast) {
    // clear section of old data
    forecastEl.empty();
    $('#forecast-title').empty();

    // print section name
    $('#forecast-title').textContent = '5-Day Forecast:'

    // loop through 5 day to create cards
    for (var i = 0; i < 5; i++) {
        let dayCard = document.createElement('div');
        let cardHead = document.createElement('h4');
        let cardImg = document.createElement('img');
        let cardBody = document.createElement('div');

        // make div a card
        dayCard.classList = 'card bg-dark';

        // add date to card
        let date = new Date(forecast[i].dt * 1000);
        cardHead.textContent = date.toLocaleDateString('en-US');
        cardHead.classList = 'card-header text-white';
        dayCard.append(cardHead);

        // add icon to card
        let iconUrl = 'https://openweathermap.org/img/w/' + forecast[i].weather[0].icon + '.png';
        $(cardImg).attr('src', iconUrl);
        cardImg.classList = 'card-img-top';
        dayCard.append(cardImg);

        // add data to card
        let temp = document.createElement('p');
        temp.textContent = 'Temp: ' + forecast[i].temp.day + '°F';
        cardBody.append(temp);

        let wind = document.createElement('p');
        wind.textContent = 'Wind: ' + forecast[i].wind_speed + ' MPH';
        cardBody.append(wind);

        let humidity = document.createElement('p');
        humidity.textContent = 'Humidity: ' + forecast[i].humidity + '%'
        cardBody.append(humidity);

        cardBody.classList = 'card-body';
        dayCard.append(cardBody);

        // print card to page
        forecastEl.append(dayCard);
    }
}

// function to send city name to city arr
function saveSearchTerm(lat, lon, city) {
    let cityObj = {
        "name": city,
        "lat": lat,
        "lon": lon
    }

    // if searched history exists, push to history
    if (recentSearchArr) {
        recentSearchArr.push(cityObj);
    } else {
        // else, make arr contain new search term
        recentSearchArr = [cityObj];
    }

    // create button and add to page
    let recentBtnEl = document.createElement('button');
    $(recentBtnEl).addClass('btn btn-outline-info btn-block m-1 recent-btn').text(city);
    $(recentBtnEl).attr('data-lat', cityObj.lat);
    $(recentBtnEl).attr('data-lon', cityObj.lon);
    recentSearchesEl.prepend(recentBtnEl);

    // save city
    handleLocalStorage();
}

// function to save array to storage
function handleLocalStorage() {
    if (!localStorage.getItem('recentCities')) {
        // if no saved search terms, then save the search terms
        localStorage.setItem('recentCities', JSON.stringify(recentSearchArr));
    } else {
        // else remove that item from storage and replace it with updated arr
        localStorage.removeItem('recentCities');
        localStorage.setItem('recentCities', JSON.stringify(recentSearchArr));
    }
}

// function to add stored search terms to page as buttons
function printStorage() {
    if (localStorage.getItem('recentCities')) {
        let storedCities = JSON.parse(localStorage.getItem('recentCities'));

        // recentSearchArr = [localStorage.getItem('recentCities')];
        if (storedCities) {

            recentSearchArr = storedCities;

            // iterate through saved arr to make btns
            $(recentSearchArr).each(i => {
                let recentBtnEl = document.createElement('button');
                $(recentBtnEl).addClass('btn btn-outline-info btn-block m-1 recent-btn').text(recentSearchArr[i].name);
                $(recentBtnEl).attr('data-lat', recentSearchArr[i].lat);
                $(recentBtnEl).attr('data-lon', recentSearchArr[i].lon);
                recentSearchesEl.prepend(recentBtnEl);
            })
        }
    }

}


// start the search (run in event listener)
function handleSearchClick(e) {
    // if button is search, run search using input as term
    if (e.target.matches('#search-btn')) {
        e.preventDefault();

        // get the user search term (city)
        let city = cityInput.val().trim();

        if (city) {
            // pass to city coords func
            cityAsLatLon(city);
        } else {
            alert("Something went wrong! Try searching for a city that actually exists.")
        }
    }
}

// search from a recent search term function
function handleRecentSearch(e) {
    let btnClicked = e.target;

    // if button clicked is a recent search btn, run a search
    if (btnClicked.matches('.recent-btn')) {

        let searchTerm = $(btnClicked).text();
        let searchLat = $(btnClicked).attr('data-lat');
        let searchLon = $(btnClicked).attr('data-lon');

        //run search on recent search term
        getWeatherData(searchLat, searchLon, searchTerm);

        //remove the clicked btn so there aren't a bunch of duplicate btns
        recentSearchesEl.remove(btnClicked);
    }
}

/* LISTENERS */
// on load (print recent)
$(document).ready(printStorage);

// listen for button click/new search
$(searchFormEl).on('click', '#search-btn', handleSearchClick);
// listen for recent search button click
$(recentSearchesEl).on('click', handleRecentSearch);
// listen for uncaught error in promise
$(window).on('unhandledrejection', function (error) {
    console.log(error);
    alert('Something went wrong! Try again.');
})