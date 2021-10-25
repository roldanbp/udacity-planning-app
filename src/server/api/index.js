const { baseFetch } = require('../../util')


/**
 * It retrieve data using GET method from the URL assigned.
 * @param {string} url
 */
const executeGET = async (url) => {
    
    try {
        const response = await baseFetch(url, 'GET');
        const parsedResponse = await response.json();
        return parsedResponse;
    } catch(error) {
        console.log("Error" , error)
        return error;
    }
}

module.exports =  { 
    executeGET,
}