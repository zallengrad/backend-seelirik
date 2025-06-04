const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8090 }); 

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🟢 Klien WebSocket terhubung');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔴 Klien WebSocket terputus');
  });
});

// Fungsi untuk mengirim pesan ke semua klien
function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(data);
    }
  }
}

module.exports = { broadcast };
