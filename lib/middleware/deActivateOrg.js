const stripe = require('stripe')(process.env.STRIPE_SECRET);

const cancelSubscription = id => {
  return stripe.subscriptions.update(
    id,
    { cancel_at_period_end: true }
  )
    .catch(error => ({ error }));
};

const deActivateOrg = (req, res, next) => {
  console.log('req user', req.body.user);
  return cancelSubscription(req.body.user.stripeSubId)
    .then(subRes => {
      console.log('cancel sub res', subRes);
      next();
    })
    .catch(next);
};

module.exports = { deActivateOrg };
