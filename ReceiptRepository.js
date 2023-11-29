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
            this.db.run(`INSERT INTO Receipt (ReceiptID,StoreName,TotalCost, date, imageSrc) VALUES ('${data.ID}','${data.MarketName}', ${data.Total}, '${data.date.replace(/\./g,'-')}', '${data.imageSrc}')`, (err) => {
                if(err)
                    console.error(err.message);
                console.log(`inserted data ${data.ID}`);
                console.log(`INSERT INTO Receipt (ReceiptID,StoreName,TotalCost, date) VALUES ('${data.ID}','${data.MarketName}', ${data.Total}, ${data.date})`);
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
    async getReceiptByDate(dateMax, dateMin) {
        let data = await this.ReadAll(`select * from Receipt where date between '${dateMax}' and '${dateMin}'`,this.db);
        return data;
    }
    async deleteAll() {
        this.db.run('delete * from Receipt', (err) => {
            if(err)
                console.error(`delete failed ${err.message}`);
        });
    }
    async getReceiptByID(id) {
        let data = await this.ReadAll(`select * from Receipt where ReceiptID = '${id}'`, this.db);
        return data;
    }
}module.exports = ReceiptRepository;