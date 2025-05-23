const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const userRoutes = require('./api/users/routes');
  const userHandler = require('./api/users/handler');
  const riwayatRoutes = require('./api/riwayat/routes');
  const riwayatHandler = require('./api/riwayat/handler');

  server.route(userRoutes(userHandler));
  server.route(riwayatRoutes(riwayatHandler));

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
