const {
  postCameraHandler,
  getCamerasHandler,
  updateCameraHandler,
  deleteCameraHandler,
} = require('./cameraHandler');

const cameraRoutes = [
  {
    method: 'POST',
    path: '/cameras',
    handler: postCameraHandler,
  },
  {
    method: 'GET',
    path: '/cameras',
    handler: getCamerasHandler,
  },
  {
    method: 'PUT',
    path: '/cameras/{id}',
    handler: updateCameraHandler,
  },
  {
    method: 'DELETE',
    path: '/cameras/{id}',
    handler: deleteCameraHandler,
  },
];

module.exports = cameraRoutes;
