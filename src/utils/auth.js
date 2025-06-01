require('dotenv').config();
console.log('🔐 JWT SECRET:', process.env.JWT_SECRET_KEY);
console.log('👋 auth.js loaded');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const hashPassword = async (password) => await bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = async (plain, hash) => await bcrypt.compare(plain, hash);

const generateToken = (payload) => {
  console.log('🔐 Signing token with:', SECRET_KEY);
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
};
const verifyToken = (token) => {
  console.log('🔐 Verifying token with:', SECRET_KEY);
  return jwt.verify(token, SECRET_KEY);
};

const verifyAuthHeader = (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Invalid Authorization header');
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('🪪 JWT Received:', token.slice(0, 30), '...');

  try {
    const decoded = verifyToken(token);
    console.log('✅ JWT Decoded:', decoded);
    return decoded;
  } catch (err) {
    console.error('❌ JWT Verification Failed:', err.message);
    throw new Error('Invalid token');
  }
};


module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  verifyAuthHeader,
};
