const baseFetch = require('../../util')

const executeGET = async (url) => {
    
    try {
        const response = await baseFetch(url, 'GET');
        const parsedResponse = await response.json();
        return {status: 200, data: parsedResponse};
    } catch(error) {
        console.log("Error" , error)
        return {status: 500, data: error}
    }
}

module.exports =  { 
    executeGET,
}