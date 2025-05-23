const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/routes');
const userHandler = require('./api/users/handler');
const kameraRoutes = require('./api/kamera/routes');
const kameraHandler = require('./api/kamera/handler');
const riwayatRoutes = require('./api/riwayat/routes');
const riwayatHandler = require('./api/riwayat/handler');



const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'], // Izinkan semua origin (frontend bisa akses)
      },
    },
  });

  server.route(userRoutes(userHandler));
  server.route(kameraRoutes(kameraHandler));
  server.route(riwayatRoutes(riwayatHandler));


  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();