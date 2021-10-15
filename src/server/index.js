require('dotenv').config()
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');
const User =  require('./model/userModel');
const authentication =  require('./middleware/autentication');
const app = express();
const { executeGET } = require('./api')
const dataStore = {
    users: []
};

const PORT = 8081;
const GEONAME_BASE_URL = 'http://api.geonames.org/searchJSON';
const WEATTHER_BIT_BASE_URL = 'https://api.weatherbit.io/v2.0/current';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('dist'));

app.post('/search-country', authentication, async (req, res) => {
    let userIndex = 0;
    const {countryValue, dateValue, userId} = req.body;
    const geonameURL = `${GEONAME_BASE_URL}?name_equals=${countryValue}&name=${countryValue}&username=${process.env.GEONAME_NAME_KEY}`;    

    const geoNames = await executeGET(geonameURL);
    const { lat: latitude, lng: longitude} = geoNames && geoNames.data.geonames[0];

    const weatherbitURL = `${WEATTHER_BIT_BASE_URL}?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHER_API_KEY}`;
    const weatherResult = await executeGET(weatherbitURL);
    const weatherData = weatherResult.data.data[0];

    const pixabayURL = `${PIXABAY_BASE_URL}?key=${process.env.PIXABAY_API_KEY}&q=${countryValue}&image_type=photo`;
    const pixabayResult = await executeGET(pixabayURL);
    const pixabayImage = pixabayResult.data.hits[0].webformatURL;

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

    const userName = `${req.body.userId}-${Math.random()}`;
    const time = new Date(Date.now()).toDateString();
    const id = req.body.userId;
    const user = new User(id, userName, time);

    if (dataStore.users.length > 0) {
        userIndex = dataStore.users.findIndex(user => user.id == userId);
        dataStore.users[userIndex].searches.push(userSearch);
        res.send({code: 200, user, currentSearch: userSearch, searches: dataStore.users[userIndex].searches});
    } else {
        dataStore.users.push(user);
        dataStore.users[0].searches.push(userSearch);
        res.send({code: 200, user ,currentSearch: userSearch, searches: dataStore.users[userIndex].searches});
    }  
})

app.post('/sign-in', (req,res) => {
    const userName = req.body.userValue ? req.body.userValue : 'GUEST';
    const time = new Date(Date.now()).toDateString();
    const id = `${req.body.userValue}-${Math.random()}`;
    const user = new User(id, userName, time);
    dataStore.users.push(user);
    res.send(user)
})

app.listen(PORT, () => console.log(`Running on ports ${PORT}`))