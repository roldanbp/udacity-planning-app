require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const { executeGET } = require('./api');
const dataStore = {
    savedSearches: [],
    searchHistory: []
};

const PORT = 8081;
const GEONAME_BASE_URL = 'http://api.geonames.org/searchJSON';
const WEATTHER_BIT_BASE_URL = 'https://api.weatherbit.io/v2.0/current';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('dist'));

/**
 * It render the first html element.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/view", "index.html"));
})

/**
 * It retrieves data from different APIs using the data provided 
 * by the user and return a object as a result mixing all of API results.
 */
app.post('/search-country', async (req, res) => {
    const {countryValue, dateValue} = req.body;
    const geonameURL = `${GEONAME_BASE_URL}?name_equals=${countryValue}&name=${countryValue}&username=${'roldan'}`;  // Username will be replace for the env variable after the last review.   

    const geoNames = await executeGET(geonameURL);
    const { lat: latitude, lng: longitude} = geoNames && geoNames.geonames[0];

    const weatherbitURL = `${WEATTHER_BIT_BASE_URL}?lat=${latitude}&lon=${longitude}&key=${'829a45b17a5c4accabf1406e4c369433'}`; // Key will be replace for the env variable after the last review.
    const weatherResult = await executeGET(weatherbitURL);
    const weatherData = weatherResult.data[0];

    const pixabayURL = `${PIXABAY_BASE_URL}?key=${'23671774-7eba73f4691822ab682b00c5d'}&q=${countryValue}&image_type=photo`; // Key will be replace for the env variable after the last review.
    const pixabayResult = await executeGET(pixabayURL);
    const pixabayImage = pixabayResult.hits[0].webformatURL;

    const userSearch = {
        searchDate: dateValue,
        cityName: weatherData.city_name,
        clouds: weatherData.clouds,
        windSpeed: weatherData.wind_spd,
        snow: weatherData.snow,
        temp: weatherData.temp,
        weather: weatherData.weather.description,
        image: pixabayImage,
    }
    
    dataStore.search = userSearch;
    dataStore.searchHistory.push(userSearch);
    
    res.send({code: 200, search: dataStore.search, searchHistory: dataStore.searchHistory});
})

/**
 * It saves the trip in the dataStore savedSearches.
 */
app.post('/save-trip', (req, res) => {
    const search = req.body;
    dataStore.savedSearches.push(search);
    res.send({message: "Your trip was saved.", savedSearches: dataStore.savedSearches});
})

/**
 * It returns saved searches stored in dataStore. 
 */
app.get('/searchs-information', (req,res) => {
    res.send({savedSearches: dataStore.savedSearches, searchHistory: dataStore.searchHistory})
})

app.listen(PORT, () => console.log(`Running on ports ${PORT}`))