const { Router } = require('express');
const User = require('../models/User');
const { activateOrg } = require('../middleware/activateOrg');
const { sendMail } = require('../middleware/sendMail');
const { verifyEmail } = require('../middleware/verifyEmail');

module.exports = Router()
  .post('/payment', activateOrg, sendMail, (req, res, next) => {
    const { stripeToken, stripeSubId, user, previewUrl, code } = req.body;

    User
      .findOneAndUpdate({ _id: user._id }, { stripeToken, stripeSubId }, { new: true })
      .then(user => {
        res.send({
          user,
          token: user.authToken(),
          previewUrl,
          code
        });
      })
      .catch(next);
  })

  .get('/verify-email', verifyEmail, (req, res, next) => {
    User
      .findOneAndUpdate({ _id: req.userId }, { role: 'org' }, { new: true })
      .then(user => {
        res.send({
          user,
          token: user.authToken(),
          actId: req.actId
        });
      })
      .catch(next);
  });
