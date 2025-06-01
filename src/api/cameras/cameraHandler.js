const { verifyAuthHeader } = require('../../utils/auth');
const { addCamera, findCameraByDeviceId } = require('../../services/cameraService');
const { startCameraWorker } = require('../../services/worker');

const postCameraHandler = async (request, h) => {
  try {
    const decoded = verifyAuthHeader(request);
    const { name, device_id } = request.payload;

    if (!name || !device_id) {
      return h.response({ message: 'Name and device_id are required' }).code(400);
    }

    const { camera, error } = await addCamera({
      user_id: decoded.id,
      name,
      device_id,
    });

    console.log('✅ [DEBUG] Payload:', { user_id: decoded.id, name, device_id });
    console.log('📸 [DEBUG] Inserted Camera:', camera);
    console.log('⚠️ [DEBUG] Supabase Insert Error:', error);

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


module.exports = {
  postCameraHandler,
};
