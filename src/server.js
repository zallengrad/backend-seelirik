const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');
const http = require('http');
const { Server } = require('socket.io');





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

  // Tambahkan routes Hapi seperti biasa
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return { message: 'SeeLirik Backend is running!' };
      },
    },
    ...userRoutes,
    ...cameraRoutes,
    ...historyRoutes,
  ]);

  // 🔌 Siapkan HTTP server manual untuk socket.io
  const httpServer = http.createServer(server.listener);

  // 🔄 Inisialisasi Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // 💾 Simpan io agar bisa dipakai di worker.js
  server.app.io = io;

  // 🔁 Handler saat frontend connect ke websocket
  io.on('connection', (socket) => {
    console.log('🟢 Client terhubung:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Client keluar:', socket.id);
    });
  });

  await server.initialize(); // opsional (untuk test)
  await server.start();

  // Gunakan httpServer untuk mendengar (bukan server.listener langsung)
  httpServer.listen(server.info.port, () => {
    console.log('🚀 SeeLirik Backend + Socket.IO aktif di:', server.info.uri);
  });
};


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
