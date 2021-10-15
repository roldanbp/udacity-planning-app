require('../styles/base.scss');

const { isLocalStorageAvailable } = require('./util/localStorage');
const { searchData, loginUser } = require('./services');

const countryInput = document.querySelector('#country-input');
const dateInput = document.querySelector('#date-input');
const submitButton = document.querySelector('#submit');
const loading = document.querySelector('#loading');
const placeholder = document.querySelector('#content-placeholder');
const login = document.querySelector('#login');
const modalButtonLogin = document.querySelector('#modal-button');
const modalInput = document.querySelector('#modal-input');
const userNameContainer = document.querySelector('#user-name-container');
const resultDataContainer = document.querySelector('#content-result-data');
const cardResultContainer = document.querySelector('#wrapper__content-result');
const resultImagePlace = document.querySelector('#result-data-img');
const resultDataPlaceName = document.querySelector('#result-data-place');
const resultWeather = document.querySelector('#result-weather');
const resultWind = document.querySelector('#result-wind');
const resultClouds = document.querySelector('#result-clouds');
const resultTemp = document.querySelector('#result-temp');
const modalLogin = document.querySelector("#loginModal");
const modalLoginClose = document.querySelector(".close");


/**
 * Show up the loading screen while the data is being retrieved. 
 */
const showLoading = () => {
    loading.style.display = 'flex';
    placeholder.style.display = 'none'
    if(resultDataContainer) {
        resultDataContainer.style.display = 'none';
    }
}

const closeModal = (target) => {
    const isLoginButton = target == modalButtonLogin;
    const isCloseButton = target == modalLoginClose;
    const isWindow = target == modalLogin;
    if ( isLoginButton || isCloseButton || isWindow) {
        modalLogin.style.display = "none";
}
}


const buildGreetins = (data) => {
    const grettings = document.createElement('p');
    if (!document.querySelector('#greetins')) {
        grettings.id = "greetins";
        grettings.innerHTML = `Hi, <span class="grettings">${data.name}</span>`
        grettings.style.color = '#1c8696';
        grettings.fontWeight = 800;
        grettings.fontSize = '20px';
        userNameContainer.style.marginLeft = '40px';
        userNameContainer.appendChild(grettings);
        modalLogin.style.display = "none";
    } else {
        document.querySelector('#greetins').innerHTML = `Hi, <span class="grettings">${data.name}</span>`;
        modalLogin.style.display = "none";
    }
}
const executeLogin = async (event) => {
    if(event) {event.preventDefault();}
    const userValue = modalInput.value;
    
    const response = await loginUser({userValue})
    isLocalStorageAvailable() && localStorage.setItem('user',JSON.stringify(response));
    buildGreetins(response);
}

login.addEventListener('click', (event) => {
    if(event) { event.preventDefault()};
    
    modalLogin.style.display = "block";
    modalLoginClose.addEventListener('click', (event) => closeModal(event.target));
    window.addEventListener('click', (event) => closeModal(event.target));
    modalButtonLogin.addEventListener('click', (event) => executeLogin(event));
})


/**
 * 
 */
submitButton.addEventListener('click', async (event) => {
    if(event) { event.preventDefault()}
    
    const countryValue = countryInput.value;
    const dateValue = dateInput.value;
    const user = isLocalStorageAvailable() && JSON.parse(localStorage.getItem('user'));
    const userId = user && user.id;
    
    if (countryValue, dateValue) {
        showLoading()
        
        try {
            const response = await searchData({ countryValue, dateValue, userId });
            isLocalStorageAvailable() && localStorage.setItem('user',JSON.stringify(response.user));
            updateUI(response)
        }catch(error) {
            console.log("Error", error);
        }
    }
    
    return null; // TODO pintar error en input
    
})

const updateUI = (data) => {
    loading.style.display = 'none';
    resultDataContainer.style.display = 'flex';
    
    const result = data.currentSearch;
    cardResultContainer.style.height = '600px';
    cardResultContainer.style.width = '550px';
    resultDataContainer.style.width = '100%';
    resultDataContainer.style.flexDirection = 'column';
    resultDataContainer.style.alignItems = 'center';
    
    resultImagePlace.src = result.image;
    resultDataPlaceName.textContent = result.cityName;
    resultTemp.textContent = result.temp;
    resultClouds.textContent = result.clouds;
    resultWeather.textContent = result.weather;
    resultWind.textContent = result.windSpeed;
}