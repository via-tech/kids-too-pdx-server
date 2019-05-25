const User = require('../models/User');
const { HttpError } = require('./error');

const authenticateUser = Database => (req, res, next) => {
  return User
    .findByToken(req.body.token)
    .then(user => {
      return Database
        .findById(req.params.id)
        .then(foundData => {
          const dataId = foundData.user || req.params.id;

          return dataId === user._id ? next() : next(new HttpError(403, 'Access denied'));
        })
        .catch(next);
    });
};

module.exports = { authenticateUser };
