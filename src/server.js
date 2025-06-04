const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');

const http = require('http');
const { WebSocketServer } = require('ws');
const { setBroadcast } = require('./global'); // untuk simpan fungsi broadcast

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['http://localhost:3002', 'https://your-frontend.vercel.app'], // sesuaikan untuk produksi
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  });

  // Tambahkan route dasar
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { message: 'SeeLirik Backend is running!' };
    },
  });

  // Tambahkan semua route lainnya
  server.route(userRoutes);
  server.route(cameraRoutes);
  server.route(historyRoutes);

  // Jalankan Hapi server
  await server.start();
  console.log(`🚀 Hapi.js aktif di ${server.info.uri}`);

  // Jalankan WebSocket di port yang sama
  const listener = http.createServer(server.listener);
  const wss = new WebSocketServer({ server: listener });

  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('🟢 Client WebSocket terhubung');
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
      console.log('🔴 Client WebSocket terputus');
    });
  });

  const broadcast = (message) => {
    const data = JSON.stringify(message);
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(data);
      }
    }
  };

  setBroadcast(broadcast); // simpan agar bisa diakses dari worker.js

  const port = process.env.PORT || 3000;
  listener.listen(port, () => {
    console.log(`📡 WebSocket + API aktif di http://0.0.0.0:${port}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
