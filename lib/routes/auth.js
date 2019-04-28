const { Router } = require('express');
// const { HttpError } = require('../middleware/error');
// const { ensureAuth } = require('../middleware/ensureAuth');
// const { roles } = require('../models/roles');
const User = require('../models/User');

const auth = Router()
  .post('/signup', (req, res, next) => {
    const { username, password, role } = req.body;
    User
      .create({ username, password, role })
      .then(user => res.send({ user, token: user.authToken() }))
      .catch(next);
  });

module.exports = auth;
