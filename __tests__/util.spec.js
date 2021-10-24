
/**
        * @jest-environment jsdom
    */
   const { isLocalStorageAvailable } = require('../src/util')


describe('Util', () => {
    it('Is local storage available', () => {
        window.localStorage = {}
        const result = isLocalStorageAvailable();
        expect(result).toBeTruthy();
    })
})