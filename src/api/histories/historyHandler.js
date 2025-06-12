const { verifyAuthHeader } = require('../../utils/auth');
const { getHistoriesByUserId } = require('../../services/historyService');
const { getHistoryById } = require('../../services/historyService');
const supabase = require('../../utils/supabaseClient');

const getHistoriesHandler = async (request, h) => {
    console.log('📥 [GET /histories] masuk');
  
    try {
      const decoded = verifyAuthHeader(request);
      console.log('✅ decoded JWT:', decoded);
  
      const { histories, error } = await getHistoriesByUserId(decoded.id);
  
      if (error) {
        console.error('❌ Error fetch histories:', error.message || error);
        return h.response({ message: 'Failed to fetch histories' }).code(500);
      }
  
      return h.response({ histories }).code(200);
    } catch (err) {
      console.error('❌ ERROR [GET /histories]:', err.message || err);
      return h.response({ message: 'Unauthorized or server error' }).code(401);
    }
  };

const getHistoryByIdHandler = async (request, h) => {
    try {
      const decoded = verifyAuthHeader(request);
      const { id } = request.params;
  
      const { history, error } = await getHistoryById(id);
      if (error || !history) {
        return h.response({ message: 'History not found' }).code(404);
      }
  
      // Pastikan user yang akses adalah pemilik kamera
      const { data: camera, error: camError } = await supabase
        .from('cameras')
        .select('user_id')
        .eq('id', history.camera_id)
        .single();
  
      if (camError || !camera || camera.user_id !== decoded.id) {
        return h.response({ message: 'Unauthorized' }).code(403);
      }
  
      return h.response({ history }).code(200);
    } catch (err) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }
  };
  
  

module.exports = {
  getHistoriesHandler,
  getHistoryByIdHandler,
};
