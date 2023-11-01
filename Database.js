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
    ReadAll() {
        //let data = [];
        return this.db.all(`select * from perfect_wallet_DB`, (err, rows) => {
            let data = [];
            if (err)
                console.error(err.message);
            rows.forEach((row) => {
                console.log('read : '+row);
                data.push(row);
            });
            return data;
        });
        //console.log(data);
    }

}module.exports = Database;