const { registerHandler, loginHandler, getAccountHandler, putAccountHandler } = require('./userHandler');

const userRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
    options: {
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      cors: true,
    },
  },
  {
    method: 'POST',
    path: '/login-test',
    handler: async (request, h) => {
      console.log('📥 /login-test masuk');
      const { email, password } = request.payload;
      return h.response({ status: 'ok', email, password }).code(200);
    },
  },
  {
    method: 'GET',
    path: '/account',
    handler: getAccountHandler,
    options: {
      cors: true,
    },
  },
  {
    method: 'PUT',
    path: '/account',
    handler: putAccountHandler,
    options: {
      cors: true,
    },
  },
];

module.exports = userRoutes; // ✅ Pastikan export-nya array!
