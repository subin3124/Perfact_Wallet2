const sqlite = require('sqlite3').verbose();
class Database{
    db;
    constructor() {
        this.db = new sqlite.Database('data.db', (err) => {if(err) console.error(err.message); console.log('db conncted.');});
    }
    Insert(data) {
        // data = [{item : '라면', qu : 1, cost : 3500}]
        for(let dt in data) {
            this.db.run(`INSERT INTO perfect_wallet_DB (item, qu, cost) VALUES (dt.item, dt.qu, dt.cost)`, (err) => {
                if(err)
                    console.error(err.message);
                console.log(`inserted data ${dt.item}`);
            });
        }
    }
    ReadAll() {
        let data;
        this.db.all('select * from perfect_wallet_DB', [], (err, rows) => {
           if(err)
               console.error(err.message);
           data = rows;
        });
        return data;
    }

}module.exports = Database;