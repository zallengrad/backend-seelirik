const { registerHandler, loginHandler, getAccountHandler, putAccountHandler } = require('./userHandler');

const userRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
    options: {
      auth: false, 
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      auth: false, 
    },
  },
  {
    method: 'GET',
    path: '/account',
    handler: getAccountHandler,
  },
  {
    method: 'PUT',
    path: '/account',
    handler: putAccountHandler,
  },  
];

module.exports = userRoutes;
