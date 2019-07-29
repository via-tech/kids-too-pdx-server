const { createHttpError } = require('./error');

const verifyEvent = (req, res, next) => {
  const { ageMin, ageMax, liability } = req.body;

  if(!liability) return next(createHttpError(400, 'Liability agreement required'));

  if(ageMin < 0 || ageMax > 100) return next(createHttpError(400, 'Invalid age range'));

  return next();
};

module.exports = { verifyEvent };
