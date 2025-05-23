const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const { registerUserSchema, loginUserSchema } = require('./validator');
const { verifyToken } = require('../../utils/auth');

const usersFilePath = path.join(__dirname, '../../../data/users.json');

// Baca users.json secara asynchronous
async function loadUsersFromFile() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Tulis users.json secara asynchronous
async function saveUsersToFile(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

const registerUserHandler = async (request, h) => {
  const validationResult = registerUserSchema.validate(request.payload);
  if (validationResult.error) {
    return h.response({
      status: 'fail',
      message: validationResult.error.message,
    }).code(400);
  }

  const { username, email, password, storeName, storeLocation, storeDescription } = request.payload;

  const users = await loadUsersFromFile();

  if (users.find((u) => u.email === email)) {
    return h.response({
      status: 'fail',
      message: 'Email sudah terdaftar',
    }).code(409);
  }

  const id = nanoid(16);
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id,
    username,
    email,
    password: hashedPassword,
    storeName,
    storeLocation,
    storeDescription,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsersToFile(users);

  return h.response({
    status: 'success',
    message: 'User berhasil didaftarkan',
    data: { userId: id },
  }).code(201);
};

const loginUserHandler = async (request, h) => {
  const validationResult = loginUserSchema.validate(request.payload);
  if (validationResult.error) {
    return h.response({
      status: 'fail',
      message: validationResult.error.message,
    }).code(400);
  }

  const { email, password } = request.payload;
  const users = await loadUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return h.response({
      status: 'fail',
      message: 'Email atau password salah',
    }).code(401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return h.response({
      status: 'fail',
      message: 'Email atau password salah',
    }).code(401);
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, 'seelirik-secret', {
    expiresIn: '1h',
  });

  return {
    status: 'success',
    message: 'Login berhasil',
    data: { token },
  };
};

const getMeHandler = async (request, h) => {
  try {
    const decoded = verifyToken(request);
    const users = await loadUsersFromFile();
    const user = users.find((u) => u.id === decoded.userId);

    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan',
      }).code(404);
    }

    return {
      status: 'success',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        storeName: user.storeName,
        storeLocation: user.storeLocation,
        storeDescription: user.storeDescription,
      },
    };
  } catch (error) {
    return h.response({
      status: 'fail',
      message: error.message || 'Token tidak valid atau kadaluarsa',
    }).code(401);
  }
};

module.exports = {
  registerUserHandler,
  loginUserHandler,
  getMeHandler,
};
