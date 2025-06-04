// src/socketHandler.js
const { Server } = require('socket.io');
let io = null;

function initSocket(server) {
  io = new Server(server.listener, {
    cors: { origin: '*' }  // Ubah jika ingin dibatasi
  });

  io.on('connection', (socket) => {
    console.log('🔌 WebSocket client connected');
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO belum diinisialisasi!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
