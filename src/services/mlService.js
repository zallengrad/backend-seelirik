// mlService.js
const axios = require('axios');
const FormData = require('form-data');

const detectShopliftingReal = async (base64Image, cameraName) => {
  try {
    // Convert base64 → buffer → stream (karena FastAPI pakai UploadFile)
    const matches = base64Image.match(/^data:.*;base64,(.*)$/);
    const buffer = Buffer.from(matches[1], 'base64');

    const form = new FormData();
    form.append('image', buffer, {
      filename: 'snapshot.jpg',
      contentType: 'image/jpeg',
    });
    form.append('camera_name', cameraName);

    // const response = await axios.post('http://127.0.0.1:8001/predict', form, {
    const response = await axios.post('https://ai-service-seelirik-production.up.railway.app', form, {  
      headers: form.getHeaders(),
    });
    

    return response.data;
  } catch (error) {
    console.error('❌ Gagal fetch ke model ML:', error.message);
    return null;
  }
};

module.exports = {
  detectShopliftingReal,
};
