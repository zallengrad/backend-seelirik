const supabase = require('../utils/supabaseClient');

const simpanKeRiwayat = async ({
  camera_id,
  camera_name,
  label,
  photo,
  bounding_box,
  video_path,
}) => {
    const nowUTC = new Date();
    const nowWIB = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // UTC + 7 jam
    

  const { data, error } = await supabase
    .from('detection_history')
    .insert(
      [
        {
          camera_id,
          camera_name,
          label,
          photo,
          bounding_box,
          video_path,
          detected_date: nowWIB.toISOString().split('T')[0],
          detected_time: nowWIB.toTimeString().split(' ')[0], // WIB
        },
      ],
      { returning: 'representation' }
    )
    .single();

  return { riwayat: data, error };
};

const getHistoriesByUserId = async (user_id) => {
    // 1. Ambil semua kamera milik user
    const { data: cameras, error: cameraError } = await supabase
      .from('cameras')
      .select('id')
      .eq('user_id', user_id);
  
    if (cameraError) return { histories: null, error: cameraError };
  
    const cameraIds = cameras.map((cam) => cam.id);
  
    if (cameraIds.length === 0) return { histories: [], error: null };
  
    // 2. Ambil semua deteksi dari kamera-kamera itu
    const { data, error } = await supabase
      .from('detection_history')
      .select('*')
      .in('camera_id', cameraIds)
      .order('created_at', { ascending: false });
  
    return { histories: data, error };
  };
  
  
  const getHistoryById = async (id) => {
    const { data, error } = await supabase
      .from('detection_history')
      .select('*')
      .eq('id', id)
      .single();
  
    return { history: data, error };
  };
  
  module.exports = {
    simpanKeRiwayat,
    getHistoriesByUserId,
    getHistoryById, 
  };
  