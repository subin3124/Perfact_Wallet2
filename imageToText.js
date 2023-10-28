async function detectText(fileName) {
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'imgtotext-402215-ab70869cba9a.json',
  });

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  //const fileName = './resources/test.jpg';

  // Performs text detection on the local file
  const [result] = await client.textDetection('tesseract_sample.png');
  const detections = result.textAnnotations;
  console.log('Text:');
  detections.forEach(text => console.log(text));
}
detectText();