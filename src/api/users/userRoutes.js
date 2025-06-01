const { registerHandler, loginHandler, getAccountHandler, putAccountHandler } = require('./userHandler');

const userRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
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
