const { detectShopliftingDummy } = require('./mlService');
const { simpanKeRiwayat } = require('./historyService');

// Registry untuk semua kamera yang sedang jalan loop deteksinya
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
    }
  }, 10_000); // interval 10 detik

  // Simpan interval ID agar bisa dihentikan nanti
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
