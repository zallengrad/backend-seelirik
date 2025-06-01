const detectShopliftingDummy = async (imageBase64) => {
    // Simulasi hasil deteksi: 50% kemungkinan terdeteksi
    const detected = Math.random() > 0.5;
  
    if (!detected) return null;
  
    // Dummy hasil deteksi
    return {
      label: 'Shoplifting Detected',
      bounding_box: {
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 200),
        width: 100,
        height: 150,
      },
      video_path: 'https://dummy.video.path/shoplifting.mp4', // placeholder
    };
  };
  
  module.exports = {
    detectShopliftingDummy,
  };
  

//   real
// const axios = require('axios');

// const detectShopliftingReal = async (imageBase64) => {
//   try {
//     const response = await axios.post('http://localhost:8000/predict', {
//       image: imageBase64,
//     });

//     return response.data; // harus mengandung label, bbox, video_path, dll
//   } catch (error) {
//     console.error('Gagal fetch ke ML:', error.message);
//     return null;
//   }
// };

// module.exports = {
//     detectShopliftingDummy: detectShopliftingReal, // nanti tinggal ganti ini
//   };
