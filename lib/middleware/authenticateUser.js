const { HttpError } = require('./error');

const authenticateUser = Database => (req, res, next) => {
  return Database
    .findById(req.params.id)
    .then(foundData => {
      const dataId = foundData.user || foundData._id;

      return dataId.toString() === req.body.user._id || req.body.user.role === 'admin' ? next() : next(new HttpError(403, 'Access denied'));
    })
    .catch(next);
};

module.exports = { authenticateUser };
