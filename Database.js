const sqlite = require('sqlite3').verbose();
class Database{
    db;
    constructor() {
        this.db = new sqlite.Database('data.db', (err) => {if(err) console.error(err.message); console.log('db conncted.');});
    }
    getInstance() {
        return this.db;
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
    async ReadAll(query,db){
        return new Promise(function(resolve,reject){
            db.all(query, function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });
    }

}module.exports = Database;