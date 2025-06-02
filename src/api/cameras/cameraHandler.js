const { verifyAuthHeader } = require('../../utils/auth');
const {
  addCamera,
  findCameraByDeviceId,
  getCamerasByUserId,
  updateCameraById,
  deleteCameraById,
} = require('../../services/cameraService');
const {
  startCameraWorker,
  stopCameraWorker,
} = require('../../services/worker');



// POST /cameras
const postCameraHandler = async (request, h) => {
  try {
    const decoded = verifyAuthHeader(request);
    const { name, device_id } = request.payload;

    if (!name || !device_id) {
      return h.response({ message: 'Name and device_id are required' }).code(400);
    }

    // Cek apakah device_id sudah pernah digunakan oleh user ini
    const { data: existing, error: findError } = await supabase
      .from('cameras')
      .select('*')
      .eq('user_id', decoded.id)
      .eq('device_id', device_id)
      .single();

    if (existing) {
      console.log('🔁 [INFO] Device ID sudah pernah digunakan. Hapus data lama:', existing.id);
      await supabase
        .from('cameras')
        .delete()
        .eq('id', existing.id); // hard delete baris lama
    }

    // Tambahkan entri baru
    const { camera, error } = await addCamera({
      user_id: decoded.id,
      name,
      device_id,
    });

    if (error || !camera) {
      return h.response({ message: 'Failed to add camera', error }).code(500);
    }

    startCameraWorker(camera);

    return h.response({
      message: 'Camera added successfully',
      camera,
    }).code(201);
  } catch (err) {
    console.error('❌ JWT/SERVER ERROR:', err.message);
    return h.response({ message: 'Unauthorized or server error' }).code(401);
  }
};


// GET /cameras
const getCamerasHandler = async (request, h) => {
  try {
    const decoded = verifyAuthHeader(request);
    const { cameras, error } = await getCamerasByUserId(decoded.id);

    if (error) return h.response({ message: 'Failed to fetch cameras' }).code(500);
    return h.response({ cameras }).code(200);
  } catch (err) {
    return h.response({ message: 'Unauthorized' }).code(401);
  }
};

// PUT /cameras/:id
const updateCameraHandler = async (request, h) => {
  try {
    verifyAuthHeader(request);
    const { id } = request.params;
    const { name, device_id } = request.payload;

    const updates = { name, device_id };
    const { camera, error } = await updateCameraById(id, updates);

    if (error || !camera) {
      return h.response({ message: 'Failed to update camera' }).code(500);
    }

    // 🔁 Restart worker kamera
    stopCameraWorker(id);
    startCameraWorker(camera);

    return h.response({
      message: 'Camera updated & worker restarted',
      camera,
    }).code(200);
  } catch (err) {
    return h.response({ message: 'Unauthorized' }).code(401);
  }
};


// DELETE /cameras/:id
const deleteCameraHandler = async (request, h) => {
  try {
    verifyAuthHeader(request);
    const { id } = request.params;

    const { camera, error } = await deleteCameraById(id);
    if (error || !camera) {
      return h.response({ message: 'Failed to delete camera' }).code(500);
    }

    stopCameraWorker(id); // 🛑 Stop loop jika kamera dihapus

    return h.response({ message: 'Camera deleted (deactivated)', camera }).code(200);
  } catch (err) {
    return h.response({ message: 'Unauthorized' }).code(401);
  }
};


module.exports = {
  postCameraHandler,
  getCamerasHandler,
  updateCameraHandler,
  deleteCameraHandler,
};