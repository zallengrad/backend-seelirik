const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');

const http = require('http');
const { WebSocketServer } = require('ws');
const { setBroadcast } = require('./global'); // ✅ tambahkan

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  });

  server.route({ method: 'GET', path: '/', handler: () => ({ message: 'SeeLirik Backend is running!' }) });
  server.route(userRoutes);
  server.route(cameraRoutes);
  server.route(historyRoutes);

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

  setBroadcast(broadcast); // ✅ simpan ke global

  await server.initialize();
  listener.listen(server.info.port, () => {
    console.log(`🚀 SeeLirik Backend + WebSocket aktif di: ${server.info.uri}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
