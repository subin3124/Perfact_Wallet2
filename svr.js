const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const static = require('serve-static');
const cors = require('cors');
const dbconfig = require('./config/dbconfig.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', static(path.join(__dirname, 'public')));

app.post('/GyoyangFromDB', (req, res) => {
    console.log('GyoyangFromDB 호출됨')
    
    const query1 = req.body.query1;
    const resData = {}
    resData.result = 'error'
    resData.time = []
    resData.num = []

    pool.getConnection((err, conn)=>{
        if (err) {
            conn.release();
            console.log('pool.getConnection 에러발생');
            console.dir(err);
            res.json(resData);
            return;
        }

        conn.query(`select * from test where ${query1};`, (error, rows, fields)=>{
            if (error) {  // db query 실패
                conn.release();
                console.dir(error);
                res.json(resData);
                return;
            }

            conn.release();
            resData.result = 'ok';

            rows.forEach((val)=>{
                resData.num.push(val.num)
                resData.time.push(val.time)
            })
            res.json(resData);
        })
    })
    
})

app.listen(3000, ()=>{
    console.log('Server started at 3000');
})