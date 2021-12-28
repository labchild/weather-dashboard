const apiKey = '9eb608ca3fd28254d7792ab2bad5b46c';

var cityInput = $('#search-city');
var searchFormEl = $('#search-form');
var cityNameEl = $('#city-name');
var currentWeatherEl = $('#current-weather');
var forecastEl = $('#5-day-container');
var recentSearchesEl = $('#search-history');

// $(searchFormEl).on('click', '#search-btn', function() { console.log(cityInput.val().trim()) });

// function getWeatherData(city){
//     fetch(apiUrl).then((res) => {
//         console.log('success!', city, res);
//     });
// }

// get weather data
// create api url based on user data
// call api – fetch()
    // if response, then pass relevant data to print function save city name to storage
    // else throw error message
// catch error

// print weather data
// get city name from data obj
    // $(h2 for city-name).textContent( city and date from data obj )
    // add span for obj in textContent
// get weather details from data obj
    // key is bold, val is normal
    // append to page in current-weather 
// loop through 5 day to create cards
    // append to page in 5-day-container
// print button with city name to search-history and save in stored arr

// start the search (run in event listener)
// get the user search term (city)
// pass into get weather data func

// store city names
// get city names arr from storage on load to print
    // if city names arr is empty, now it's new search term in arr
    // else .push new term
// save to storage

/* LISTENERS */
// on load (print recent)
// if local storage, push to task arr

// listen for button click/new search
// listen for recent search button click