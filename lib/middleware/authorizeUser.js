const User = require('../models/User');
const Event = require('../models/Event');
const { HttpError } = require('./error');

const authenticateUser = (req, res, next) => {
  return User
    .findByToken(req.body.token)
    .then(user => {
      return Event
        .findById(req.params.id)
        .then(foundEvent => foundEvent.user === user._id ? next() : next(new HttpError(403, 'Access denied')))
        .catch(next);
    });
};

module.exports = { authenticateUser };
