const fetch = require('node-fetch');

const baseFetch = (url, method, body) => {
    
    const params = {
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (body) {
        params.body = JSON.stringify(body)
    }
    
    return fetch(url, params);
}

const isLocalStorageAvailable = () => {
    try {
        var storage = window.localStorage,
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

module.exports = { baseFetch, isLocalStorageAvailable  }