const { postPushSubscriptionHandler } = require('./pushSubscriptionHandler');

const routes = [
  {
    method: 'POST',
    path: '/push-subscriptions',
    handler: postPushSubscriptionHandler,
    options: {
    },
  },
];

module.exports = routes;
