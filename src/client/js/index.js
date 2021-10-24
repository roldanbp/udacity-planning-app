require('../styles/base.scss');
require('swiper/css/bundle');
require('swiper/css/pagination');

const { Swiper, Pagination, Navigation} = require('swiper');
const { baseFetch } = require('../../util')

const { isLocalStorageAvailable } = require('../../util');
const { executePOST } = require('./services');
const headerContainer = document.querySelector('#header-content');
const countryInput = document.querySelector('#country-input');
const dateInput = document.querySelector('#date-input');
const submitButton = document.querySelector('#submit');
const resultContainer = document.querySelector("#result-container");
const resultImagePlace = document.querySelector("#result-image-place");
const resultNamePlace = document.querySelector("#result-name-place");
const resultWeatherPlace = document.querySelector("#result-weather-place");
const resultWeatherTemp = document.querySelector("#weather-temp");
const resultWeatherCloud = document.querySelector("#weather-cloud");
const resultWeatherWind = document.querySelector("#weather-wind");
const resultWeatherSnow = document.querySelector("#weather-snow");
const upArrow = document.querySelector("#up-arrow");
const saveAction = document.querySelector("#save-action");
const snackbar = document.querySelector("#snackbar");
const SwipperWrapper = document.querySelector("#swiper-wrapper");
const SearchedTripsContainer = document.querySelector("#searched-trips");
const savedTripsContainer = document.querySelector("#saved-trips");
const savedTripsWrapper = document.querySelector("#save-trip-wrapper");
  
const updateResultUI = ({cityName, clouds, image, snow, temp, weather, windSpeed}) => {
    resultContainer.style.display = 'flex';
    resultImagePlace.src = image;
    resultNamePlace.textContent = cityName;
    resultWeatherPlace.textContent = weather;
    resultWeatherTemp.textContent = temp;
    resultWeatherCloud.textContent = clouds;
    resultWeatherWind.textContent = windSpeed;
    resultWeatherSnow.textContent = snow;
    resultContainer.scrollIntoView({block: "end", behavior: "smooth"});
    
}

const updateHistoryUI = (data) => {
    while (SwipperWrapper.firstChild) {
        SwipperWrapper.removeChild(SwipperWrapper.lastChild);
    }
    data.map(search => {
        const image = document.createElement('img');
        const slideContainer = document.createElement('div');
        const placeNameContainer = document.createElement('div');
        const placeName = document.createElement('h1');
        placeName.style.backgroundColor = 'rgb(0,0,0, 0.7);';
        placeNameContainer.style.width = '100%';
        placeNameContainer.style.height = '100%';
        placeNameContainer.className = "wrapper-content";
        placeName.textContent = search.cityName;
        image.src = search.image;
        slideContainer.className = "swiper-slide";
        slideContainer.appendChild(image);
        placeNameContainer.appendChild(placeName);
        slideContainer.appendChild(placeNameContainer);
        SwipperWrapper.appendChild(slideContainer);
        SearchedTripsContainer.style.display = 'block';
    })
}

const updateSavedUI = (data) => {
    while (savedTripsContainer.firstChild) {
        savedTripsContainer.removeChild(savedTripsContainer.lastChild);
    }
    data && data.map(savedSearch => {
        const savedSearchContainer = document.createElement('div');
        const placeImage = document.createElement('img');
        
        const infoContainer = document.createElement('div');
        const weatherContainer = document.createElement('div');
        const weatherInfo = document.createElement('p');
        
        const timeContainer = document.createElement('div');
        const timeInfo = document.createElement('p');
        
        
        placeImage.src = savedSearch.image;
        weatherInfo.innerHTML = `<h1> Remember, it'll be a <span class="save-stand-out-weather">${savedSearch.weather}</span> day</h1>`
        
        const currentDate = new Date();
        const todayDate = currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
        const date1 = new Date(todayDate);
        const date2 = new Date(savedSearch.searchDate);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        
        const inDays = 1000 * 3600 * 24;
        
        timeInfo.innerHTML = `<h1> Your trip will be in <span class="save-stand-out-date">${diffTime / inDays}</span> days</h1>`;
        timeContainer.className = "saved-time-container";
        timeContainer.appendChild(timeInfo);
        
        weatherContainer.className = "saved-weather-container";
        weatherContainer.appendChild(weatherInfo)
        
        infoContainer.className = "saved-info-container";
        infoContainer.appendChild(timeContainer)
        infoContainer.appendChild(weatherContainer)
        
        savedSearchContainer.className = "saved-search-card"
        savedSearchContainer.appendChild(placeImage)
        savedSearchContainer.appendChild(infoContainer)
        
        savedTripsWrapper.style.display = "flex";
        savedTripsContainer.appendChild(savedSearchContainer);
    })
}

submitButton.addEventListener('click', async (event) => {
    if(event) { event.preventDefault()}
    
    const countryValue = countryInput.value;
    const dateValue = dateInput.value;
    
    if (countryValue, dateValue) {
        
        try {
            const response = await executePOST('/search-country', { countryValue, dateValue });
            isLocalStorageAvailable() && localStorage.setItem('search', JSON.stringify(response.search));
            updateResultUI(response.search);
            updateHistoryUI(response.searchHistory);
        } catch(error) {
            console.log("Error", error);
        }
    }
    
    return null;
    
})

upArrow.addEventListener('click', event => {
    headerContainer.scrollIntoView({block:"start", behavior: "smooth"});
})

saveAction.addEventListener('click', async () => {
    
    try {
        const currentSearch = isLocalStorageAvailable() && JSON.parse(localStorage.getItem('search'));
        const response = await executePOST('/save-trip', currentSearch);
        updateSavedUI(response.savedSearches);
        snackbar.className = "show";
        snackbar.textContent = response.message;
        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, 2000);
    } catch(error) {
        console.log("Error", error);
    }
})

document.onreadystatechange = async () => {
    if (document.readyState === 'complete') {
        
        try {
            const response = await baseFetch('/searchs-information', 'GET');
            const parsedResonse = await response.json()
            updateHistoryUI(parsedResonse.searchHistory);
            updateSavedUI(parsedResonse.savedSearches)
        } catch(error) {
            console.log("Error: " , error)
        }
    }
};

Swiper.use([Navigation, Pagination])

new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 10,
    direction: 'horizontal',
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    420: {
        slidesPerView: 2,
        spaceBetween: 10
    },
});
  
