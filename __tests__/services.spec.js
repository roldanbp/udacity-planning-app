require('jest-fetch-mock').enableMocks()
const { executePOST } = require('../src/client/js/services');
const { executeGET } = require('../src/server/api');


beforeEach(() => {
    fetch.resetMocks();
})

describe('services', () => {
    
    it('Executing post', async () => {
        const expected = {
            data: "test"
        }
        fetch.mockResponseOnce(JSON.stringify({data: "test"}));
        const result = await executePOST('url', {body: "test"});
        expect(result).toEqual(expected);
        expect(fetch).toHaveBeenCalledTimes(1);
    })
    
    it('Executing get', async () => {
        const expected = {
            data: "test"
        }
        fetch.mockResponseOnce(JSON.stringify({data: "test"}));
        const result = await executeGET('url');
        expect(result).toEqual(expected);
        expect(fetch).toHaveBeenCalledTimes(1);
    })
})