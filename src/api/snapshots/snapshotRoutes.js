// src/api/snapshots/snapshotRoutes.js
const { postSnapshotHandler } = require('./snapshotHandler');

const snapshotRoutes = [
  {
    method: 'POST',
    path: '/snapshots',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // max 10MB
        timeout: false,
      },
    },
    handler: postSnapshotHandler,
  },
];

module.exports = snapshotRoutes;
