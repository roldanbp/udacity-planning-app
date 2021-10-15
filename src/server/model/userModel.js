class User {
    constructor(id, name, registrationDate, searches = []) {
        this.id = id;
        this.name = name;
        this.registrationDate = registrationDate;
        this.searches = searches;
    }    
    
    getRegistrationDate() {
        return this.registrationDate;
    }
    
    getSearches() {
        return this.searches;
    }
    
    getName() {
        return this.name;
    }
}

module.exports = User