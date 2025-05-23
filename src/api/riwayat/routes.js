const routes = (handler) => [
    {
      method: 'POST',
      path: '/riwayat',
      handler: handler.addRiwayatHandler,
    },
    {
      method: 'GET',
      path: '/riwayat',
      handler: handler.getAllRiwayatHandler,
    },
  ];
  
  module.exports = routes;