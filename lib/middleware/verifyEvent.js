const { createHttpError } = require('./error');

const verifyEvent = (req, res, next) => {
  const { ageMin, ageMax, liability, user } = req.body;

  if(!liability) return next(createHttpError(400, 'Liability agreement required'));

  if(ageMin < 0 || ageMax > 100) return next(createHttpError(400, 'Invalid age range'));

  if(user.role === 'inactive') return next(createHttpError(403, 'This account has been deactivated. Please confirm payment to re-gain access'));

  return next();
};

module.exports = { verifyEvent };
