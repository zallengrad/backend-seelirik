const { getHistoriesHandler, getHistoryByIdHandler } = require('./historyHandler');

const historyRoutes = [
  {
    method: 'GET',
    path: '/histories',
    handler: getHistoriesHandler,
  },
  {
    method: 'GET',
    path: '/histories/{id}',
    handler: getHistoryByIdHandler,
  },
];

module.exports = historyRoutes;
