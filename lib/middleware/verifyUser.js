const User = require('../models/User');
const { createHttpError } = require('./error');

const verifyUser = (req, res, next) => {
  const { username, password } = req.body;

  User
    .findOne({ $or: [{ username }, { email: username }] })
    .then(user => {
      if(!user) return next(createHttpError(401, 'Bad email or password'));

      if(user.role === 'inactive' && req.url !== '/activate') return next(createHttpError(403, 'This account has been deactivated. Please confirm payment to re-gain access'));

      return Promise.all([
        Promise.resolve(user),
        user.compare(password)
      ]);
    })
    .then(([user, correctPassword]) => {
      if(correctPassword) {
        req.body.verified = {
          user,
          token: user.authToken()
        };
        next();
      } else {
        next(createHttpError(401, 'Bad email or password'));
      }
    })
    .catch(next);
};

module.exports = { verifyUser };
