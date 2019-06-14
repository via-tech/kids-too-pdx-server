const { Router } = require('express');
const { HttpError } = require('../middleware/error');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { hash } = require('../utils/hash');
const { authenticateUser } = require('../middleware/authenticateUser');

const patcher = (body, fields) => {
  return Object.keys(body).reduce((acc, key) => {
    if(fields.includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};

module.exports = Router()
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
    console.log('username', username, 'password', password);
    User
      .findOne({ $or: [{ username }, { email: username }] })
      .then(user => {
        if(!user) return next(new HttpError(401, 'Bad email or password'));

        return Promise.all([
          Promise.resolve(user),
          user.compare(password)
        ]);
      })
      .then(([user, correctPassword]) => {
        console.log('correctPassword', { user, token: user.authToken() });
        correctPassword ? res.send({
          user,
          token: user.authToken()
        }) : next(new HttpError(401, 'Bad email or password'));
      })
      .catch(next);
  })

  .patch('/:id', ensureAuth([roles.ORG]), authenticateUser(User), (req, res, next) => {
    const patched = patcher(req.body, ['username', 'name', 'email', 'phone', 'address', 'password']);
    const updateUser = () => User
      .findOneAndUpdate({ _id: req.params.id }, patched, { new: true })
      .then(updatedUser => res.send(updatedUser))
      .catch(next);

    if(patched.password) {
      hash(patched.password)
        .then(hashedPassword => {
          patched.passwordHash = hashedPassword;
          updateUser();
        });
    } else {
      updateUser();
    }
  });
