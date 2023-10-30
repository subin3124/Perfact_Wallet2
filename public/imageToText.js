const { ImageAnnotatorClient } = require('@google-cloud/vision');

const client = new ImageAnnotatorClient({
  keyFilename: 'imgtotext-402215-ab70869cba9a.json',
});

async function detectText() {
  const [result] = await client.textDetection('sample5.jpg');
  const annotations = result.textAnnotations;
  console.log('Text:');
  annotations.forEach(annotation => {
    return annotation.description;
  });
}
detectText();