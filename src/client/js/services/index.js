const { baseFetch } = require('../../../util')

/**
 * It retrieve data using POST method from the URL assigned.
 * @param {string} url
 * @param {Object} body
 */
const executePOST = async (url, body) => {
    try {
        const response = await baseFetch(url, 'POST', body);
        const parsedResponse = response.json();
        return parsedResponse;
    } catch(error) {
        console.log("Error" , error)
    }    
}

module.exports = {
    executePOST,
}