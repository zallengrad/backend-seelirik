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
  
  module.exports = {
    addCamera,
    findCameraByDeviceId, 
  };
  

