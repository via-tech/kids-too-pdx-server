const { HttpError } = require('./error');

const validateEvent = (req, res, next) => {
  const { ageMin, ageMax } = req.body;
  return ageMin >= 0 && ageMax <= 100 ? next()
    : next(new HttpError(400, 'Invalid age range'))
      .catch(next);
};

module.exports = { validateEvent };
