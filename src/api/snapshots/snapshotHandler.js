// src/api/snapshots/snapshotHandler.js
const { detectShopliftingReal } = require('../../services/mlService');
const { simpanKeRiwayat } = require('../../services/historyService');
const { verifyAuthHeader } = require('../../utils/auth');
// const fetch = require('node-fetch');
require('dotenv').config();

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || 'http://localhost:4000';

const streamToBase64 = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

const postSnapshotHandler = async (request, h) => {
  try {
    const decoded = verifyAuthHeader(request);
    const { image, camera_id, camera_name } = request.payload;

    if (!image || !camera_id || !camera_name) {
      return h.response({ message: 'Missing fields' }).code(400);
    }

    const base64Image = await streamToBase64(image);

    const result = await detectShopliftingReal(base64Image, camera_name);

    if (!result || !result.detected) {
      return h.response({ message: 'No suspicious activity' }).code(200);
    }

    const { label, bounding_box, video_path, photo, confidence } = result;

    const simpan = await simpanKeRiwayat({
      camera_id,
      camera_name,
      label,
      photo,
      bounding_box,
      video_path,
    });

    if (simpan.error) {
      return h.response({ message: 'Failed to save history' }).code(500);
    }

    // Emit ke WebSocket Server
    try {
      await fetch(`${SOCKET_SERVER_URL}/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_detection',
          payload: {
            camera_name,
            label,
            photo,
            bounding_box,
            confidence,
          },
        }),
      });

      console.log('📡 Emit ke WebSocket server berhasil!');
    } catch (err) {
      console.error(`⚠️ Emit ke WebSocket (${SOCKET_SERVER_URL}) gagal:`, err.message);
    }

    return h.response({
      message: 'Suspicious activity detected',
      riwayat: simpan.riwayat,
    }).code(200);

  } catch (err) {
    console.error('❌ ERROR [POST /snapshots]:', err.message || err);
    return h.response({ message: 'Unauthorized or internal error' }).code(500);
  }
};

module.exports = {
  postSnapshotHandler,
};
