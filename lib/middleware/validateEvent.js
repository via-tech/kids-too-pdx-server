const { HttpError } = require('./error');

const errorHandler = (errCode, message) => new HttpError(errCode, message);

const validateEvent = (req, res, next) => {
  const { ageMin, ageMax, liability } = req.body;

  if(!liability) return next(errorHandler(400, 'Liability agreement required'));

  if(ageMin < 0 || ageMax > 100) return next(errorHandler(400, 'Invalid age range'));

  return next();
};

module.exports = { validateEvent };
