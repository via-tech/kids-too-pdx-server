const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');
const { verifySignUp } = require('../middleware/verifySignUp');
const { verifyUser } = require('../middleware/verifyUser');
const { patcher } = require('../services/patcher');
const { recoverPass } = require('../middleware/recoverPass');

module.exports = Router()
  .post('/signup', verifySignUp, (req, res, next) => {
    User
      .create(req.body)
      .then(user => res.send({
        user: user.toJSON(),
        token: user.authToken()
      }))
      .catch(next);
  })

  .post('/signin', verifyUser, (req, res, next) => {
    const { user, token, error } = req.body;
    if(error) next();
    res.send({ user, token });
  })

  .patch('/:id', ensureAuth([roles.ORG]), authenticateUser(User), patcher('user'), (req, res, next) => {
    const { patched } = req.body;

    User
      .findOneAndUpdate({ _id: req.params.id }, patched, { new: true })
      .then(user => res.send({
        user,
        token: user.authToken()
      }))
      .catch(next);
  })

  .post('/forgot', recoverPass, (req, res, next) => {
    if(req.body.error) next();
    res.send(req.body);
  })

  .delete('/:id', ensureAuth([roles.ADMIN]), (req, res, next) => {
    User
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
