const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { registerUserSchema, loginUserSchema } = require('./validator');
const { verifyToken } = require('../../utils/auth');

const usersFilePath = path.join(__dirname, '../../../data/users.json');

// Fungsi untuk load data user dari file JSON
function loadUsersFromFile() {
  try {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Fungsi untuk simpan data user ke file JSON
function saveUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

const registerUserHandler = async (request, h) => {
  const validationResult = registerUserSchema.validate(request.payload);
  if (validationResult.error) {
    return h.response({
      status: 'fail',
      message: validationResult.error.message,
    }).code(400);
  }

  const {
    username,
    email,
    password,
    storeName,
    storeLocation,
    storeDescription,
  } = request.payload;

  const users = loadUsersFromFile();

  if (users.find((u) => u.email === email)) {
    return h.response({
      status: 'fail',
      message: 'Email sudah terdaftar',
    }).code(409);
  }

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id,
    username,
    email,
    password: hashedPassword,
    storeName,
    storeLocation,
    storeDescription,
    createdAt,
  };

  users.push(newUser);
  saveUsersToFile(users);

  return h.response({
    status: 'success',
    message: 'User berhasil didaftarkan',
    data: {
      userId: id,
    },
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
  const users = loadUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return h.response({
      status: 'fail',
      message: 'Email atau password salah',
    }).code(401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
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
    data: {
      token,
    },
  };
};

const getMeHandler = async (request, h) => {
  try {
    const decoded = verifyToken(request);
    const users = loadUsersFromFile();
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
