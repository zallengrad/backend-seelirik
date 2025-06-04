const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');
const { initSocket } = require('./socketHandler'); // ⬅️ Tambahan

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'], 
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { message: 'SeeLirik Backend is running!' };
    },
  });

  server.route(userRoutes);
  server.route(cameraRoutes);
  server.route(historyRoutes);

  await server.start();
  console.log('🚀 SeeLirik Backend Server berjalan di:', server.info.uri);

  initSocket(server); // ⬅️ Aktifkan WebSocket setelah server Hapi jalan
};
