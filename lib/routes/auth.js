
const { Router } = require('express');
const { HttpError } = require('../middleware/error');
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
  })

  .post('/signin', (req, res, next) => {
    const { username, password } = req.body;
    User
      .findOne({ username })
      .then(user => {
        if(!user) return next(new HttpError(401, 'Bad email or password'));

        return Promise.all([
          Promise.resolve(user),
          user.compare(password)
        ]);
      })
      .then(([user, correctPassword]) => {
        correctPassword ? res.send({
          user,
          token: user.authToken()
        }) : next(new HttpError(401, 'Bad email or password'));
      })
      .catch(next);
  });

module.exports = auth;
