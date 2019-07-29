const stripe = require('stripe')(process.env.STRIPE_SECRET);

const cancelSubscription = id => {
  return stripe.subscriptions.update(
    id,
    { cancel_at_period_end: true }
  )
    .catch(error => {
      throw error;
    });
};

const deActivateOrg = (req, res, next) => {
  return cancelSubscription(req.body.user.stripeSubId)
    .then(() => {
      next();
    })
    .catch(next);
};

module.exports = { deActivateOrg };
