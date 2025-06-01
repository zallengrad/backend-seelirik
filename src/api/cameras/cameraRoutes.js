const { postCameraHandler } = require('./cameraHandler');

const cameraRoutes = [
  {
    method: 'POST',
    path: '/cameras',
    handler: postCameraHandler,
  },
];

module.exports = cameraRoutes;
