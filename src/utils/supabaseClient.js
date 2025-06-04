const { createClient } = require('@supabase/supabase-js');

console.log('🔐 Loading supabaseClient.js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('🌍 SUPABASE_URL:', supabaseUrl);
console.log('🔑 SUPABASE_ANON_KEY:', supabaseAnonKey ? 'ADA' : 'TIDAK ADA');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase URL atau Anon Key tidak tersedia di environment variable!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
