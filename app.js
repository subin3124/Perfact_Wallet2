// 필요한 모듈을 불러오기
const express = require('express');
const mysql = require('mysql2');
const https = require('https');
const path = require('path');
const fs = require('fs');

const static = require('serve-static');
const cors = require('cors');
const dbconfig = require('./config/dbconfig.json');
const azureconfig = require('./config/azureconfig.json');
const {ImageAnnotatorClient} = require("@google-cloud/vision");
const multer  = require('multer')
const {response, json} = require("express");
const {createServer} = require("http");
const ExcelJS = require("./ExcelJS");
const ReceiptItemRepository = require("./ReceiptItemRepository");
const ReceiptRepository = require("./ReceiptRepository");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
        // 이 경로로 저장=> 작업영역/uploads/videos/
    },
    filename:(req,file,cb)=>{
        cb(null,"image"+"_"+Date.now()+".jpg");
        // 저장방식=> image_현재시간.jpg 형식
    }
});

const upload = multer({ storage})
const client = new ImageAnnotatorClient({
    keyFilename: 'imgtotext-402215-ab70869cba9a.json',
});

const receiptItemRepository = new ReceiptItemRepository();
const receiptRepository = new ReceiptRepository();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/docs', express.static(__dirname + '/doc'));

app.post('/excel/input:/id',upload.single('file'),async (req, res) => {
    const excel = new ExcelJS();
    await excel.loadWorkbook(req.file.filename);
    excel.setSheet('one');
    let data = excel.getRows();
    console.log(data);
    insertReceiptItem(data);
});

// DB에서 데이터를 검색하고 클라이언트에 응답
app.post('/callDB', (req, res) => {
    console.log(req.body.data);
    insertReceiptItem(req.body.data);
    res.send(JSON.stringify({status:'ok'}));
});
app.get('/getDB', async (req, res) => {
    res.send(await receiptRepository.ReadAll('select * from Receipt', receiptRepository.getInstance()));
});
function insertReceiptItem(data) {
    console.log(data);
    receiptItemRepository.Insert(data);
    // 쿼리문
    //console.log(`insert into perfect_wallet (item, qu, cost) values ('${query_item}', ${query_qu}, ${query_cost});`);
}
app.get('/excel/:ReceiptID', async (req, res) => {
    let data3 = []; //db 호출 후 여기다 데이터 집어넣을 것.  [{item : '라면', qu : 1, cost : 5000}] (반드시 array형태일것)
    let data = [];
    console.log('1');
    let data2 = await receiptRepository.getReceiptByID(req.param('ReceiptID'));
    data3 = await receiptItemRepository.getItemsByReceiptID('ReceiptID');
    console.log('tes'+data3.item+','+data2.date)
    for(let dt in data3) {
        data.push({
            date:data2.date,
            item:data3.item,
            qu:data3.qu,
            cost:data3.cost
        });
    }
    console.log('debug : ' + data);
    const excel = new ExcelJS();
    excel.addWorkSheet('workSheet1');
    excel.setSheet('workSheet1');
    excel.initColumns();
    excel.addRows(data);
    let workbook = excel.getWorkbook()
    workbook.xlsx.write(res).then((r) => res.end());
});
app.get('/Receipt/Item/:ReceiptID', (req, res) => {
   let recID = req.param('ReceiptID');
   res.send(receiptItemRepository.getItemsByReceiptID(recID));
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
    console.log(url);
    fetch('https://inuesc.cognitiveservices.azure.com/formrecognizer/documentModels/prebuilt-receipt:analyze?api-version=2023-07-31', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': `${azureconfig.key}`
        },
        body: `{'urlSource': '${url}'}`
    }).
    then((r) => {
        let url2 = r.headers.get("Operation-location");
        console.log("abcd"+r.status);
        console.log("aaa"+url2);
        setTimeout(function() {
            fetch(url2, {
                headers: {
                    'Ocp-Apim-Subscription-Key': `${azureconfig.key}`
                }
            })  .then((response) => {
                    console.log(response.status);
                    console.log(response.body);
                    return response.json()})
                .then((data) => {
                    res.set({
                        'content-type': 'application/json',
                        'imageUrl' : `${url}`
                    });
                    let receiptID = `${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getMilliseconds()}`
                    receiptRepository.Insert({
                        ID : receiptID,
                        MarketName: data.analyzeResult.documents[0].fields.MerchantName.valueString,
                        Total: data.analyzeResult.documents[0].fields.Total.valueNumber,
                        imageSrc: url,
                        date: data.analyzeResult.documents[0].fields.TransactionDate.content
                    });
                    let Itemdata = [];
                    for(let array in data.analyzeResult.documents[0].fields.Items.valueArray) {
                        Itemdata.push({objectName: data.analyzeResult.documents[0].fields.Items.valueArray[array].valueObject.Description.content,
                            price: data.analyzeResult.documents[0].fields.Items.valueArray[array].valueObject.TotalPrice.valueNumber,
                            qu: data.analyzeResult.documents[0].fields.Items.valueArray[array].valueObject.Quantity.valueNumber,
                            ReceiptID: receiptID});
                    }
                    insertReceiptItem(Itemdata);
                    console.log(data.analyzeResult.documents[0].fields)
                    res.send({ReceiptID:receiptID,imageUrl:url})
                });
        }, 3000);
    }).catch((reason) =>{
        console.log(reason);
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
