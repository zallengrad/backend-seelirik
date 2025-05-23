const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../../utils/auth');

const kameraFilePath = path.join(__dirname, '../../../data/kamera.json');
const riwayatFilePath = path.join(__dirname, '../../../data/riwayat.json');

function loadFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const addRiwayatHandler = (request, h) => {
  try {
    const { kameraId, kategori, image, video, deskripsi } = request.payload;
    const kamera = loadFromFile(kameraFilePath);
    const targetKamera = kamera.find((k) => k.id === kameraId);

    if (!targetKamera) {
      return h.response({
        status: 'fail',
        message: 'Kamera tidak ditemukan',
      }).code(404);
    }

    const userId = targetKamera.userId;
    const riwayat = loadFromFile(riwayatFilePath);

    const newRiwayat = {
      id: nanoid(14),
      userId,
      kameraId,
      kategori,
      image,
      video,
      timestamp: new Date().toISOString(),
      deskripsi,
    };

    riwayat.push(newRiwayat);
    saveToFile(riwayatFilePath, riwayat);

    return h.response({
      status: 'success',
      message: 'Riwayat aktivitas berhasil disimpan',
      data: { riwayatId: newRiwayat.id },
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Gagal menyimpan riwayat aktivitas',
    }).code(500);
  }
};

const getAllRiwayatHandler = (request, h) => {
  try {
    const { userId } = verifyToken(request);
    const riwayat = loadFromFile(riwayatFilePath);
    const riwayatUser = riwayat.filter((r) => r.userId === userId);

    return {
      status: 'success',
      data: riwayatUser,
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Token tidak valid',
    }).code(401);
  }
};

module.exports = {
  addRiwayatHandler,
  getAllRiwayatHandler,
};
