const User = require('../models/User');
const { createHttpError } = require('./error');

const bearerToken = req => {
  const authHeader = req.get('Authorization') || '';
  const token = authHeader.replace(/Bearer\s/i, '');

  req.token = token;
};

const ensureAuth = roles => (req, res, next) => {
  bearerToken(req);
  return User
    .findByToken(req.token)
    .then(user => {
      if(user && roles.includes(user.role)) {
        req.body.user = user;
        next();
      } else if(!user) {
        next(createHttpError(401, 'No user with that token'));
      } else {
        next(createHttpError(403, 'Access denied'));
      }
    })
    .catch(next);
};

module.exports = { ensureAuth };
