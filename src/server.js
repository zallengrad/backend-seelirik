const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');
const http = require('http');
const { Server } = require('socket.io');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000, // Railway otomatis atur PORT
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
    },
  });

  // Tambahkan semua route
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

  // 🔌 Bungkus Hapi dengan http server
  const httpServer = http.createServer(server.listener);

  // 🔄 Inisialisasi Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // 💾 Simpan io ke dalam server.app
  server.app.io = io;

  io.on('connection', (socket) => {
    console.log('🟢 Client terhubung:', socket.id);
    socket.on('disconnect', () => {
      console.log('🔴 Client keluar:', socket.id);
    });
  });

  await server.initialize(); // Inisialisasi plugin/route

  // Ganti server.start() dengan httpServer.listen()
  const port = server.info.port;
  httpServer.listen(port, () => {
    console.log(`🚀 Server berjalan di: http://0.0.0.0:${port}`);
  });
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
