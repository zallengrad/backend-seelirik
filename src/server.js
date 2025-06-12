require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt'); // ✅ Tambah ini

const userRoutes = require('./api/users/userRoutes');
const cameraRoutes = require('./api/cameras/cameraRoutes');
const historyRoutes = require('./api/histories/historyRoutes');
const snapshotRoutes = require('./api/snapshots/snapshotRoutes');
const pushSubscriptionRoutes = require('./api/pushSubscriptions/pushSubscriptionRoutes');


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

  // ✅ Registrasi JWT
  await server.register(Jwt);

  // ✅ Strategi Auth
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400,
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
          email: artifacts.decoded.payload.email,
        },
      };
    },
  });

  // ✅ Set default auth
  server.auth.default('jwt');

  // Root endpoint
  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { message: 'SeeLirik Backend is running!' };
    },
    options: {
      auth: false, // tidak butuh auth
    },
  });

  // Routes utama
  server.route(userRoutes);
  server.route(cameraRoutes);
  server.route(historyRoutes);
  server.route(snapshotRoutes);
  server.route(pushSubscriptionRoutes);

  await server.start();
  console.log('🚀 SeeLirik Backend Server berjalan di:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
