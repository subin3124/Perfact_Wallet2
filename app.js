// 필요한 모듈을 불러오기
const express = require('express');
const mysql = require('mysql2');
const https = require('https');
const path = require('path');
const fs = require('fs');

const static = require('serve-static');
const cors = require('cors');
const dbconfig = require('./config/dbconfig.json');
const {ImageAnnotatorClient} = require("@google-cloud/vision");
const multer  = require('multer')
const {response} = require("express");
const {createServer} = require("http");
const ExcelJS = require("./ExcelJS");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
        // 이 경로로 저장=> 작업영역/uploads/videos/
    },
    filename:(req,file,cb)=>{
        cb(null,"image"+"_"+Date.now()+".jpg");
        // 저장방식=> id_현재시간.mp4 형식
    }
});
const Httpsoptions = {
    key: fs.readFileSync('./escinu.kro_kr_key'),
    cert: fs.readFileSync('./escinu_kro_kr.crt'),
    ca  : fs.readFileSync('./escinu_kro_kr.ca-bundle')
};

const upload = multer({ storage})
const client = new ImageAnnotatorClient({
    keyFilename: 'imgtotext-402215-ab70869cba9a.json',
});
// MySQL 연결을 위한 풀을 생성
const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
});


const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', static(path.join(__dirname, 'public')));

app.post('/excel/input:/id',upload.single('file'),async (req, res) => {
    const excel = new ExcelJS();
    await excel.loadWorkbook(req.file.filename);
    excel.setSheet('one');
    let data = excel.getRows();
    for(let d in data) {
        insertDB(d[0], d[1], d[2]);
    }
});

// DB에서 데이터를 검색하고 클라이언트에 응답
app.post('/callDB', (req, res) => {
    insertDB(req.body.objectName,req.body.price,req.body.qu);
});
function insertDB(objectName, price, qu) {
    const query_item = objectName;
    const query_cost = price;
    const query_qu = qu;  // 수량 받는 부분

    // 쿼리문
    console.log(`insert into perfect_wallet (item, qu, cost) values ('${query_item}', ${query_qu}, ${query_cost});`);

    // 쿼리 결과를 받아서 data 객체에 저장하고 응답
    pool.getConnection((err, conn)=>{
        if (err) {
            conn.release();
            console.log('pool.getConnection 에러발생: ' + err.message);
            console.dir(err);
            res.json(data);
            return;
        }

        conn.query(`insert into perfect_wallet (item, qu, cost) values ('${query_item}', ${query_qu}, ${query_cost});`, (error, rows, fields)=>{
            if (error) {  // db query 실패
                conn.release();
                console.dir(error);
                res.json(data);
                return;
            }
            conn.release();
        })
    })
}
app.get('/excel/:id', (req, res) => {
    let data //db 호출 후 여기다 데이터 집어넣을 것.  [{item : '라면', qu : 1, cost : 5000}] (반드시 array형태일것) 

    data.item = []
    data.qu = []
    data.cost = []

    // 쿼리문
    console.log(`select * from perfect_wallet;`);

    // 쿼리 결과를 받아서 data 객체에 저장하고 응답
    pool.getConnection((err, conn)=>{
        if (err) {
            conn.release();
            console.log('pool.getConnection 에러발생: ' + err.message); 
            console.dir(err);
            res.json(data);
            return;
        }

        conn.query(`select * from perfect_wallet;`, (error, rows, fields)=>{
            if (error) {  // db query 실패
                conn.release();
                console.dir(error);
                res.json(data);
                return;
            }
            conn.release();

            // DB의 내용을 data에 저장
            rows.forEach((val)=>{
                data.item.push(val.item)
                data.qu.push(val.qu)
                data.cost.push(val.cost)
            })
           // res.json(data);
        })
    })


     data = [{item : '라면', qu : 1, cost : 5000}];
    const excel = new ExcelJS();
    excel.addWorkSheet('workSheet1');
    excel.setSheet('workSheet1');
    excel.initColumns();
    excel.addRows(data);
    let workbook = excel.getWorkbook()
    workbook.xlsx.write(res).then((r) => res.end());
});
app.post('/image',upload.single('image'),(req, res)=> {
    console.log(req.file)
   /* const detectText = async (selectImage) => {
        const [result] = await client.textDetection(selectImage);
        const annotations = result.textAnnotations;
        console.log('Text:');
        annotations.forEach(annotation => {
            console.log(annotation.description);
            return annotation.description;
        });
    }
    detectText(req.file.path); */
    const url = 'https://inuesc.azurewebsites.net/hostingImage/'+req.file.filename;
    fetch('https://inuesc.azurewebsites.net/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '0a7af06746fb4effa619b373193f3b52'
        },
        body: {'urlSource': '${url}'}
    }).then((r) => {
        let url2 = r.headers.get("Operation-location");
        console.log("abcd"+url2);
        setTimeout(function() {
            fetch(url2, {
                headers: {
                    'Ocp-Apim-Subscription-Key': '0a7af06746fb4effa619b373193f3b52'
                }
            })  .then((response) => response.json())
                .then((data) => {res.send(data.analyzeResult.documents[0].fields); console.log(data.analyzeResult.documents[0].fields)})
        }, 3000);
    });
});
app.get('/hostingImage/:file', (req, res) =>{
    const options = {
        root: path.join(__dirname, 'uploads')
    };
    res.sendFile(req.param('file'),options);
})
// 서버를 3000번 포트에서 실행
app.listen(8080, () => {
    console.log('program started with 8080');
});
