const { ImageAnnotatorClient } = require('@google-cloud/vision');

const client = new ImageAnnotatorClient({
  keyFilename: 'imgtotext-402215-ab70869cba9a.json',
});

const detectText = async (selectImage) => {
  const [result] = await client.textDetection(selectImage);
  const annotations = result.textAnnotations;
  console.log('Text:');
  annotations.forEach(annotation => {
    return annotation.description;
  });
}
detectText();