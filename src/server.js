const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');
const { WebSocketServer } = require('ws');
const { setBroadcast } = require('./global');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['http://localhost:3002', 'https://your-frontend.vercel.app'], // ganti domain produksi
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  });

  // Tambahkan route
  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({ message: 'SeeLirik Backend is running!' }),
  });

  server.route(userRoutes);
  server.route(cameraRoutes);
  server.route(historyRoutes);

  // Jalankan server Hapi dulu
  await server.start();
  console.log(`🚀 SeeLirik Backend aktif di: ${server.info.uri}`);

  // WebSocket menggunakan listener yang sama
  const wss = new WebSocketServer({ server: server.listener });
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

  setBroadcast(broadcast);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
