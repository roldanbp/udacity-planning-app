const baseFetch = require('../../../util')

const searchData = async (body) => {
    
    try {
        const response = await baseFetch('/search-country', 'POST', body);
        const parsedResponse = response.json();
        return parsedResponse;
    } catch(error) {
        console.log("Error" , error)
    }
}


const loginUser = async (body) => {
    
    try {
        const response = await baseFetch('/sign-in', 'POST', body);
        const parsedResponse = response.json();
        return parsedResponse;
    } catch(error) {
        console.log("Error" , error)
    }
}
module.exports = {
    searchData,
    loginUser,
}