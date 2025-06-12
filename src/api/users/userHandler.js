const { hashPassword, comparePassword, generateToken } = require('../../utils/auth');
const { findUserByEmail, createUser, updateUserByEmail } = require('../../services/userService');
const { verifyAuthHeader } = require('../../utils/auth');


const registerHandler = async (request, h) => {
  const {
    email,
    password,
    username,
    store_name,
    store_description,
    address,
  } = request.payload;

  // Cek apakah email sudah terdaftar
  const { user: existingUser } = await findUserByEmail(email);
  if (existingUser) {
    return h.response({ message: 'Email already registered' }).code(400);
  }

  // Hash password
  const hashed = await hashPassword(password);

  // Insert user (tanpa return user)
  const { error: createError } = await createUser({
    email,
    password: hashed,
    username,
    store_name,
    store_description,
    address,
  });

  if (createError) {
    console.log('INSERT ERROR:', createError);
    return h.response({ message: 'Failed to register user' }).code(500);
  }

  // Ambil ulang user berdasarkan email
  const { user: newUser, error: fetchError } = await findUserByEmail(email);

  if (fetchError || !newUser) {
    console.log('FETCH ERROR:', fetchError);
    return h.response({ message: 'User created but failed to fetch data' }).code(500);
  }

  delete newUser.password;

  return h.response({ message: 'Register success', user: newUser }).code(201);
};


const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const { user, error } = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    return h.response({ message: 'Invalid email or password' }).code(401);
  }

  const token = generateToken({ id: user.id, email: user.email });
  return h.response({ message: 'Login success', token }).code(200);
};

const getAccountHandler = async (request, h) => {
    try {
      const decoded = verifyAuthHeader(request); // ambil id dari token
      const { user, error } = await findUserByEmail(decoded.email);
  
      if (error || !user) {
        return h.response({ message: 'User not found' }).code(404);
      }
  
      delete user.password;
  
      return h.response({ user }).code(200);
    } catch (err) {
      return h.response({ message: 'Unauthorized' }).code(401);
    }
  };

const putAccountHandler = async (request, h) => {
    try {
      const decoded = verifyAuthHeader(request);
      const {
        username,
        store_name,
        store_description,
        address
      } = request.payload;
  
      const updates = {};
      if (username) updates.username = username;
      if (store_name) updates.store_name = store_name;
      if (store_description) updates.store_description = store_description;
      if (address) updates.address = address;
  
      if (Object.keys(updates).length === 0) {
        return h.response({ message: 'No data to update' }).code(400);
      }
  
      const { error: updateError } = await updateUserByEmail(decoded.email, updates);
      if (updateError) {
        console.error('UPDATE ERROR:', updateError);
        return h.response({ message: 'Failed to update account' }).code(500);
      }
  
      // ✅ Ambil ulang user setelah update
      const { user: updatedUser, error: fetchError } = await findUserByEmail(decoded.email);
      if (fetchError || !updatedUser) {
        return h.response({ message: 'Failed to fetch updated user' }).code(500);
      }
  
      delete updatedUser.password;
  
      return h.response({
        message: 'Account updated successfully',
        user: updatedUser,
      }).code(200);
    } catch (err) {
      console.error('JWT ERROR:', err);
      return h.response({ message: 'Unauthorized' }).code(401);
    }
  };
  
  


module.exports = {
  registerHandler,
  loginHandler,
  getAccountHandler,
  putAccountHandler,
};
