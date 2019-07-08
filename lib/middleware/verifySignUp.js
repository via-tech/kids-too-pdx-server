require('dotenv').config();
const { createHttpError } = require('./error');
const User = require('../models/User');
const { getAllRoles } = require('../models/roles');

const verifySignUp = (req, res, next) => {
  const { role, username, password, name, email, phone, address, adminPassCode } = req.body;

  if(!getAllRoles().includes(role)
    || !username
    || !password
    || !name
    || !email
    || !phone
    || !address
  ) return next(createHttpError(400, 'Incomplete or invalid registration info'));

  return User
    .findOne({ $or: [
      { username },
      { email },
      { name },
    ] })
    .then(foundUser => {
      if(foundUser) return next(createHttpError(400, 'User already exists'));

      if(adminPassCode === process.env.ADMIN_PASS_CODE) {
        return next();
      } else if(role === 'admin') {
        return next(createHttpError(403, 'Inauthentic admin'));
      }

      req.body.role = 'inactive';

      return next();
    })
    .catch(next);
};

module.exports = { verifySignUp };
