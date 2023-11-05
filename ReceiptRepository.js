const DatabaseConnecter = require("./DatabaseConnecter");
const sqlite = require('sqlite3').verbose();
class ReceiptRepository {
    db;
    constructor() {
        this.db = new DatabaseConnecter();
    }
    getInstance() {
        return this.db;
    }
    Insert(data) {
            this.db.run(`INSERT INTO Receipt (ReceiptID,StoreName,TotalCost, date) VALUES ('${data.ID}','${data.MarketName}', ${data.Total}, ${data.date}`, (err) => {
                if(err)
                    console.error(err.message);
                console.log(`inserted data ${data.ID}`);
                console.log(`INSERT INTO Receipt (ReceiptID,StoreName,TotalCost, date) VALUES ('${data.ID}','${data.MarketName}', ${data.Total}, ${data.date}`);
            });

    }
    async ReadAll(query,db){
        return new Promise(function(resolve,reject){
            db.all(query, function(err,rows){
                if(err){return reject(err);}
                resolve(rows);
            });
        });
    }
}module.exports = ReceiptRepository;