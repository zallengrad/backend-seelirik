const routes = (handler) => [
    {
      method: 'POST',
      path: '/register',
      handler: handler.registerUserHandler,
    },
    {
      method: 'POST',
      path: '/login',
      handler: handler.loginUserHandler,
    },
    {
      method: 'GET',
      path: '/me',
      handler: handler.getMeHandler,
    },
  ];
  
  module.exports = routes;