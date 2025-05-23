const Hapi = require('@hapi/hapi');
const userRoutes = require('./api/users/routes');
const userHandler = require('./api/users/handler');
const kameraRoutes = require('./api/kamera/routes');
const kameraHandler = require('./api/kamera/handler');
const riwayatRoutes = require('./api/riwayat/routes');
const riwayatHandler = require('./api/riwayat/handler');



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
      

  server.route(userRoutes(userHandler));
  server.route(kameraRoutes(kameraHandler));
  server.route(riwayatRoutes(riwayatHandler));


  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();