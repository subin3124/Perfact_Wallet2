const FileSaver = require('file-saver');
const {createWriteStream} = require("fs");
const pngToJpeg = require("png-to-jpeg");
const fs = require("fs");

const url = 'https://inuesc.azurewebsites.net/hostingImage/image_1701190908758.png'
fetch('https://esc23.cognitiveservices.azure.com/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval', {
    method: 'post',
    headers: {
        'content-type': 'application/json',
        'Ocp-Apim-Subscription-Key': '8383352671834dca88721888168c5f96'
    },
    body: JSON.stringify({url: url})
}).then((res) => {
    console.log(res.status)
    return res.blob();
}).then(async (r) => {
    pngToJpeg({quality: 90})(Buffer.from(await r.arrayBuffer()))
        .then((output) => fs.writeFileSync(`aaa.jpg`,output));
});