const supabase = require('../utils/supabaseClient');

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return { user: data, error };
};

const createUser = async ({
  email,
  password,
  username,
  store_name,
  store_description,
  address,
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert(
      [
        {
          email,
          password,
          username,
          store_name,
          store_description,
          address,
        },
      ],
      { returning: 'representation' }
    )
    .single();

  console.log('DEBUG INSERT DATA:', data);   // 🐞 Tambahkan ini
  console.log('DEBUG INSERT ERROR:', error); // 🐞 Tambahkan ini

  return { user: data, error };
};


const updateUserByEmail = async (email, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates, { returning: 'representation' }) 
    .eq('email', email)
    .single();

  return { user: data, error };
};


module.exports = {
  findUserByEmail,
  createUser,
  updateUserByEmail, 
};

