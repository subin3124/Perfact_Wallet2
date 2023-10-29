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

// DB에서 데이터를 검색하고 클라이언트에 응답
app.post('/callDB', (req, res) => {
    console.log('callDB 호출됨')
    
    const query_objectName = req.body.objectName;
    const query_price = req.body.price;

    // 쿼리 결과를 받을 resData
    const resData = {}
    resData.result = 'error'
    resData.objectName = []
    resData.price = []


    // 최종 쿼리문
    console.log(`insert into perfect_wallet (objectName, price) values(${query_objectName}, ${query_price})`);

    // 쿼리 결과를 받아서 resData 객체에 저장하고 응답
    pool.getConnection((err, conn)=>{
        if (err) {
            console.log('pool.getConnection 에러발생: ' + err.message);
            conn.release();
            console.dir(err);
            res.json(resData);

            return;
        }

        conn.query(`insert into perfect_wallet (objectName, price) values(${query_objectName}, ${query_price})`, (error, rows, fields)=>{
            if (error) {  // db query 실패
                conn.release();
                console.dir(error);
                res.json(resData);
                return;
            }

            conn.release();
            resData.result = 'ok';

            // // DB의 내용을 resData에 저장
            // rows.forEach((val)=>{
            //     resData.이름.push(val.교과목명)
                
            // })
            // res.json(resData);
        })
    })
    
});
app.get('/excel/:id', (req, res) => {
    let data //db 호출 후 여기다 데이터 집어넣을 것.  [{item : '라면', qu : 1, cost : 5000}] (반드시 array형태일것)
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
    const url = 'https://escinu.kro.kr/hostingImage/'+req.file.filename;
    fetch('https://inuesc.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '0a7af06746fb4effa619b373193f3b52'
        },
        body: `{'urlSource': '${url}'}`
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
https.createServer(Httpsoptions,app).listen(443);