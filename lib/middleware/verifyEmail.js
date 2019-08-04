const { parse } = require('url');
const { createHttpError } = require('./error');
const Activate = require('../models/Activate');

const verifyEmail = (req, res, next) => {
  const { query } = parse(req.url, true);
  const { userId, code } = query;

  if(!userId || !code) return next(createHttpError(401, {
    message: 'Verification failed: Missing verification fields'
  }));

  req.userId = userId;

  Activate
    .findOne({ code })
    .then(act => {
      req.actId = act._id;

      if(act.user !== userId) return next(createHttpError(406, {
        message: 'Verification failed',
        actId: act._id
      }));

      Activate
        .findOneAndDelete({ _id: act._id })
        .then(() => next())
        .catch(next);
    })
    .catch(next);
};

module.exports = { verifyEmail };
