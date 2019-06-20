const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');

module.exports = Router()
  .get('/', (req, res, next) => {
    User
      .find({ role: 'org' })
      .then(orgs => res.send(orgs))
      .catch(next);
  })

  .delete('/:id', ensureAuth([roles.ORG, roles.ADMIN]), authenticateUser(User), (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.params.id }, { role: 'inactive' }, { new: true })
      .then(inactive => res.send(inactive))
      .catch(next);
  })

  .post('/activate', ensureAuth(Object.values(roles)), (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.body.user._id }, { role: 'org' }, { new: true })
      .then(activeUser => res.send(activeUser))
      .catch(next);
  });
