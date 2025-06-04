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
