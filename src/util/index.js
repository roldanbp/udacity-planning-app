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

module.exports = baseFetch