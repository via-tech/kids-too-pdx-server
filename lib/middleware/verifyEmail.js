const { parse } = require('url');
const { createHttpError } = require('./error');
const Activate = require('../models/Activate');

const verifyEmail = (req, res, next) => {
  const { query } = parse(req.url, true);
  const { userId, code } = query;

  if(!userId || !code) next(createHttpError(401, 'Missing verification fields'));

  req.userId = userId;

  Activate
    .findOne({ code })
    .then(act => {
      if(act.user !== userId) next(createHttpError(406, 'Verification failed'));

      next();
    })
    .catch(next);
};

module.exports = { verifyEmail };
