const { savePushSubscription } = require('../../services/pushSubscriptionService');

const postPushSubscriptionHandler = async (request, h) => {
  const { endpoint, keys } = request.payload;
  const userId = request.auth.credentials.id; // JWT auth

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return h.response({ message: 'Data tidak lengkap' }).code(400);
  }

  await savePushSubscription({ userId, endpoint, keys });

  return h.response({ message: 'Subscription berhasil disimpan' }).code(201);
};

module.exports = { postPushSubscriptionHandler };
