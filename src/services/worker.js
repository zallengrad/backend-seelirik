const { detectShopliftingDummy } = require('./mlService');
const { simpanKeRiwayat } = require('./historyService');
const { getBroadcast } = require('../global'); // ✅ ambil dari global
const broadcast = getBroadcast(); // ✅ langsung panggil

const cameraLoops = {};

const startCameraWorker = (camera) => {
  const { id: camera_id, name: camera_name, device_id } = camera;

  if (cameraLoops[camera_id]) {
    console.log(`📷 Worker untuk kamera '${camera_name}' sudah berjalan.`);
    return;
  }

  console.log(`🚀 Memulai worker kamera: ${camera_name} (${device_id})`);

  const interval = setInterval(async () => {
    const dummyImage = 'data:image/jpeg;base64,DUMMY_SNAPSHOT_BASE64';

    const result = await detectShopliftingDummy(dummyImage);

    if (!result) {
      console.log(`✅ Kamera '${camera_name}': Tidak ada aktivitas mencurigakan.`);
      return;
    }

    const { label, bounding_box, video_path } = result;

    const simpan = await simpanKeRiwayat({
      camera_id,
      camera_name,
      label,
      bounding_box,
      photo: dummyImage,
      video_path,
    });

    if (simpan.error) {
      console.error('❌ Gagal simpan riwayat:', simpan.error.message);
    } else {
      console.log(`📸 Deteksi dari '${camera_name}' disimpan ke riwayat!`);

      broadcast({
        type: 'new-detection',
        payload: {
          camera_id,
          camera_name,
          label,
          bounding_box,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }, 10_000);

  cameraLoops[camera_id] = interval;
};

const stopCameraWorker = (camera_id) => {
  if (cameraLoops[camera_id]) {
    clearInterval(cameraLoops[camera_id]);
    delete cameraLoops[camera_id];
    console.log(`🛑 Worker untuk kamera '${camera_id}' dihentikan.`);
  }
};

module.exports = {
  startCameraWorker,
  stopCameraWorker,
};
