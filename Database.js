const sqlite = require('sqlite3').verbose();
class Database{
    db;
    constructor() {
        this.db = new sqlite.Database('data.db', (err) => {if(err) console.error(err.message); console.log('db conncted.');});
    }
    Insert(data) {
        // data = [{item : '라면', qu : 1, cost : 3500}]
        for(let i in data) {
            this.db.run(`INSERT INTO perfect_wallet_DB (item, qu, cost) VALUES ("${data[i].objectName}", ${data[i].qu}, ${data[i].price})`, (err) => {
                if(err)
                    console.error(err.message);
                console.log(`inserted data ${data[i].objectName}`);
            });
        }
    }
    async ReadAll() {
        return await this.db.all(`select * from perfect_wallet_DB`);

    }

}module.exports = Database;