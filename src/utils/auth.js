const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seelirik-secret'; // samakan dengan yang di handler.js

function verifyToken(request) {
  const authHeader = request.headers.authorization;
  if (!authHeader) throw new Error('Token tidak ditemukan');

  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { verifyToken };
