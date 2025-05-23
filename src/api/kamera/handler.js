const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../../utils/auth');

const kameraFilePath = path.join(__dirname, '../../../data/kamera.json');

function loadKameraFromFile() {
  try {
    const data = fs.readFileSync(kameraFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveKameraToFile(kamera) {
  fs.writeFileSync(kameraFilePath, JSON.stringify(kamera, null, 2));
}

const addKameraHandler = (request, h) => {
  try {
    const { userId } = verifyToken(request);
    const { name, path: kameraPath } = request.payload;

    const kamera = loadKameraFromFile();

    const newKamera = {
      id: nanoid(12),
      userId,
      name,
      path: kameraPath,
      status: 'connected',
      createdAt: new Date().toISOString(),
    };

    kamera.push(newKamera);
    saveKameraToFile(kamera);

    return h.response({
      status: 'success',
      message: 'Kamera berhasil ditambahkan',
      data: {
        kameraId: newKamera.id,
      },
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Gagal menambahkan kamera',
    }).code(401);
  }
};

const getAllKameraHandler = (request, h) => {
  try {
    const { userId } = verifyToken(request);
    const kamera = loadKameraFromFile();
    const kameraUser = kamera.filter((k) => k.userId === userId);

    return {
      status: 'success',
      data: kameraUser,
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Token tidak valid',
    }).code(401);
  }
};

const editKameraHandler = (request, h) => {
  try {
    const { userId } = verifyToken(request);
    const { id } = request.params;
    const { name, path: kameraPath } = request.payload;

    const kamera = loadKameraFromFile();
    const index = kamera.findIndex((k) => k.id === id && k.userId === userId);

    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Kamera tidak ditemukan atau bukan milik Anda',
      }).code(404);
    }

    kamera[index].name = name;
    kamera[index].path = kameraPath;
    saveKameraToFile(kamera);

    return {
      status: 'success',
      message: 'Data kamera berhasil diperbarui',
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Gagal memperbarui kamera',
    }).code(401);
  }
};

const deleteKameraHandler = (request, h) => {
  try {
    const { userId } = verifyToken(request);
    const { id } = request.params;
    const kamera = loadKameraFromFile();
    const index = kamera.findIndex((k) => k.id === id && k.userId === userId);

    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Kamera tidak ditemukan atau bukan milik Anda',
      }).code(404);
    }

    kamera.splice(index, 1);
    saveKameraToFile(kamera);

    return {
      status: 'success',
      message: 'Kamera berhasil dihapus',
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Gagal menghapus kamera',
    }).code(401);
  }
};

module.exports = {
  addKameraHandler,
  getAllKameraHandler,
  editKameraHandler,
  deleteKameraHandler,
};
