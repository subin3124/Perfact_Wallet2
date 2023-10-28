// 필요한 모듈을 불러오기
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const static = require('serve-static');
const cors = require('cors');
const dbconfig = require('./config/dbconfig.json');

// MySQL 연결을 위한 풀을 생성
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

// DB에서 데이터를 검색하고 클라이언트에 응답
app.post('/callDB', (req, res) => {
    console.log('callDB 호출됨')
    
    const objectName = req.body.objectName;
    const price = req.body.price;

    // 쿼리 결과를 받을 resData
    const resData = {}
    resData.result = 'error'
    resData.이름 = []
    

    // 최종 쿼리문
    console.log(`select * from `);

    // 쿼리 결과를 받아서 resData 객체에 저장하고 응답
    pool.getConnection((err, conn)=>{
        if (err) {
            conn.release();
            console.log('pool.getConnection 에러발생: ' + err.message); 
            console.dir(err);
            res.json(resData);
            return;
        }

        conn.query(`select * from `, (error, rows, fields)=>{
            if (error) {  // db query 실패
                conn.release();
                console.dir(error);
                res.json(resData);
                return;
            }

            conn.release();
            resData.result = 'ok';

            // DB의 내용을 resData에 저장
            rows.forEach((val)=>{
                resData.이름.push(val.교과목명)
                
            })
            res.json(resData);
        })
    })
    
})

// 서버를 3000번 포트에서 실행
app.listen(3000, ()=>{
    console.log('Server started at 3000');
})