const { baseFetch } = require('../../../util')

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