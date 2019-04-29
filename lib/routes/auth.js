
const { Router } = require('express');
// const { HttpError } = require('../middleware/error');
// const { ensureAuth } = require('../middleware/ensureAuth');
// const { roles } = require('../models/roles');
const User = require('../models/User');

const auth = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send({
        user: user.toJSON(),
        token: user.authToken()
      }))
      .catch(next);
  });

module.exports = auth;
