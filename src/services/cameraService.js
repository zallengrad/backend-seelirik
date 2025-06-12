const supabase = require('../utils/supabaseClient');

const addCamera = async ({ user_id, name, device_id }) => {
  const { data, error } = await supabase
    .from('cameras')
    .insert([{ user_id, name, device_id, is_active: true }])
    .select()
    .single();

  return { camera: data, error };
};

const softDeleteCameraByDeviceId = async (user_id, device_id) => {
  const { data: existing, error: findError } = await supabase
    .from('cameras')
    .select('*')
    .eq('user_id', user_id)
    .eq('device_id', device_id)
    .eq('is_active', true)
    .maybeSingle();

  if (findError) return { updated: null, error: findError };
  if (!existing) return { updated: null, error: null };

  const { data: updated, error: updateError } = await supabase
    .from('cameras')
    .update({ is_active: false })
    .eq('id', existing.id)
    .select()
    .single();

  return { updated, error: updateError };
};

const findCameraByDeviceId = async (device_id) => {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .eq('device_id', device_id)
    .limit(1);

  return { camera: data, error };
};

const getCamerasByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .eq('user_id', user_id)
    .eq('is_active', true);

  return { cameras: data, error };
};

const updateCameraById = async (id, updates) => {
  const { data, error } = await supabase
    .from('cameras')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { camera: data, error };
};

const deleteCameraById = async (id) => {
  const { data, error } = await supabase
    .from('cameras')
    .update({ is_active: false }) // ✅ SOFT DELETE SAJA
    .eq('id', id)
    .select()
    .maybeSingle();

  return { camera: data, error };
};


module.exports = {
  addCamera,
  softDeleteCameraByDeviceId,
  findCameraByDeviceId,
  getCamerasByUserId,
  updateCameraById,
  deleteCameraById,
};
