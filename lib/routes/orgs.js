const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
// const { HttpError } = require('../middleware/error');
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
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
