const routes = (handler) => [
    {
      method: 'POST',
      path: '/kamera',
      handler: handler.addKameraHandler,
    },
    {
      method: 'GET',
      path: '/kamera',
      handler: handler.getAllKameraHandler,
    },
    {
      method: 'PUT',
      path: '/kamera/{id}',
      handler: handler.editKameraHandler,
    },
    {
      method: 'DELETE',
      path: '/kamera/{id}',
      handler: handler.deleteKameraHandler,
    },
  ];
  
  module.exports = routes;