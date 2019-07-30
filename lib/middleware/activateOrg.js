require('dotenv').config();
const { createHttpError } = require('./error');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { configureMail } = require('../services/emails/configureMail');

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

const mailOptions = ({ name, email }) => {
  const html = `
    <p>Hello ${name},</p>

    <p>Your account has been activated. Payment reminders and receipts will be sent to this email.</p>

    <p>Thank you!</p>
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

const activateOrg = (req, res, next) => {
  const { stripeToken, token } = req.body;
  
  if(!token) return next(createHttpError(401, 'Sign in to activate account'));

  if(!stripeToken) return next(createHttpError(401, 'Missing payment information'));

  return User
    .findByToken(req.body.token)
    .then(user => {
      if(!user) return next(createHttpError(401, 'No user with that token'));

      req.body.user = user;

      return Promise.all([
        createSubscription({ stripeToken, user }),
        configureMail()
      ])
        .then(([{ id }, transporter]) => {
          req.body.stripeSubId = id;
          req.body.transporter = transporter;
          req.body.mailOptions = mailOptions(user);

          return next();
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { activateOrg };
