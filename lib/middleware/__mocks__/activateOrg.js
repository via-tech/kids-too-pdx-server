require('dotenv').config();
const { createHttpError } = require('../error');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const User = require('../../models/User');
const generator = require('generate-password');
const Activate = require('../../models/Activate');

const verifyEmailRoute = '/activate/verify-email';

const createCustomer = ({ stripeToken, user }) => {
  return stripe.customers.create({
    description: `Customer: ${user.name}`,
    email: user.email,
    source: stripeToken
  })
    .catch(error => {
      throw error;
    });
};

const mailOptions = ({ name, email, _id, code }) => {
  const html = `
    <p>Hello ${name},</p>

    <p>To complete the activation process, please verify your email by clicking <a href="${process.env.API_URL}${verifyEmailRoute}?userId=${_id}&code=${code}">here</a>.</p>

    <p>Thank you,<br />
    The Kids 2 Youth Team!</p>
  `;

  return {
    from: 'Kids2 <donotreply@viamt.com>',
    replyTo: 'donotreply@viamt.com',
    to: email,
    subject: 'Activation Confirmation',
    html
  };
};

const createSubscription = ({ stripeToken, user }) => {
  return createCustomer({ stripeToken, user })
    .then(customer => {
      return stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: process.env.STRIPE_PLAN
          }
        ]
      });
    })
    .catch(error => {
      throw error;
    });
};

const createActivation = (user) => {
  const code = generator.generate({
    length: 10,
    numbers: true,
    symbols: false,
    uppercase: true,
    strict: true
  });

  return Activate.create({ user, code })
    .catch(err => {
      throw err;
    });
};

const activateOrg = (req, res, next) => {
  const { stripeToken, token } = req.body;
  
  if(!token) next(createHttpError(401, 'Sign in to activate account'));

  if(!stripeToken) next(createHttpError(401, 'Missing payment information'));

  User
    .findByToken(req.body.token)
    .then(user => {
      if(!user) next(createHttpError(401, 'No user with that token'));

      req.body.user = user;

      Promise.all([
        createActivation(user),
        createSubscription({ stripeToken, user })])
        .then(([{ code }, { id }]) => {
          req.body.stripeSubId = id;
          req.body.mailOptions = mailOptions({ ...user, code });

          req.body.code = code;

          next();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { activateOrg };
