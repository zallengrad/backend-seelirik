const supabase = require('../utils/supabaseClient');

  const addCamera = async ({ user_id, name, device_id }) => {
  const { data, error } = await supabase
    .from('cameras')
    .insert([{ user_id, name, device_id, is_active: true }])
    .select() // 🔍 penting: agar data dikembalikan langsung
    .single(); // 🔄 hanya satu baris

  console.log('📸 [DEBUG] Inserted Camera:', data);
  console.log('⚠️ [DEBUG] Supabase Insert Error:', error);

  return { camera: data, error };
  };
  const findCameraByDeviceId = async (device_id) => {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .eq('device_id', device_id)
      //   .single();
      .limit(1); // ganti .single() agar tidak error jika lebih dari 1
  
    return { camera: data, error };
  };
  const getCamerasByUserId = async (user_id) => {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_active', true); // hanya kamera aktif
    return { cameras: data, error };
  };
  const updateCameraById = async (id, updates) => {
    const { data, error } = await supabase
      .from('cameras')
      .update(updates)
      .eq('id', id)
      .single();
    return { camera: data, error };
  };
  const deleteCameraById = async (id) => {
    const { data, error } = await supabase
      .from('cameras')
      .delete() // 🔥 hard delete
      .eq('id', id)
      .select()
      .single();
  
    return { camera: data, error };
  };
  
  
  
  module.exports = {
    addCamera,
    findCameraByDeviceId,
    getCamerasByUserId,
    updateCameraById,
    deleteCameraById,
  };

