const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { hash } = require('../utils/hash');
const { authenticateUser } = require('../middleware/authenticateUser');
const { verifySignUp } = require('../middleware/verifySignUp');
const { verifyUser } = require('../middleware/verifyUser');
const { activateUser } = require('../middleware/activateUser');

const patcher = (body, fields) => {
  return Object.keys(body).reduce((acc, key) => {
    if(fields.includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};

module.exports = Router()
  .post('/signup', verifySignUp, activateUser, (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send({
        user: user.toJSON(),
        token: user.authToken()
      }))
      .catch(next);
  })

  .post('/signin', verifyUser, (req, res, next) => {
    res.send(req.body.verified);
    next();
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
  })

  .delete('/:id', ensureAuth([roles.ADMIN]), (req, res, next) => {
    User
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
