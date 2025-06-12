const supabase = require('../utils/supabaseClient');

const savePushSubscription = async ({ userId, endpoint, keys }) => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      { onConflict: 'endpoint' }
    );

  if (error) {
    throw new Error(`Gagal menyimpan subscription: ${error.message}`);
  }

  return data;
};

const getAllPushSubscriptions = async () => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*');

  if (error) {
    throw new Error(`Gagal mengambil subscription: ${error.message}`);
  }

  return data;
};

const getSubscriptionsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Gagal mengambil subscription user: ${error.message}`);
  }

  return data;
};

module.exports = {
  savePushSubscription,
  getAllPushSubscriptions,
  getSubscriptionsByUserId,
};
