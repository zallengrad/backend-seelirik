// worker.js
const { detectShopliftingDummy } = require('./mlService');
const { simpanKeRiwayat } = require('./historyService');

const cameraLoops = {};
let ioRef = null; // 🔑 io disimpan nanti

const startCameraWorker = (camera, io) => {
  const { id: camera_id, name: camera_name, device_id } = camera;

  if (cameraLoops[camera_id]) {
    console.log(`📷 Worker untuk kamera '${camera_name}' sudah berjalan.`);
    return;
  }

  console.log(`🚀 Memulai worker kamera: ${camera_name} (${device_id})`);

  if (!ioRef) ioRef = io; // simpan referensi io sekali saja

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

      // 💥 Emit socket event setelah io tersedia
      if (ioRef) {
        ioRef.emit('bounding-box', {
          camera_name,
          bounding_box,
          photo: dummyImage,
          label,
          video_path,
          timestamp: new Date().toISOString(),
        });
      }
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
