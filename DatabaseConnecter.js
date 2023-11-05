const sqlite = require('sqlite3').verbose();
let instance = null;
class DatabaseConnecter{
    constructor() {
        if(!instance)
            instance = new sqlite.Database('data.db', (err) => {if(err) console.error(err.message); console.log('db conncted.');});
        return instance;
    }
    getInstance() {
        return instance;
    }
} module.exports = DatabaseConnecter;