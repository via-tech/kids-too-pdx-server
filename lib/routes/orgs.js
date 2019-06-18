const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { HttpError } = require('../middleware/error');

module.exports = Router()
  .get('/', (req, res, next) => {
    User
      .find({ role: 'org' })
      .then(orgs => res.send(orgs))
      .catch(next);
  })

  .delete('/:id', ensureAuth([roles.ORG, roles.ADMIN]), (req, res, next) => {
    if(req.body.user._id === req.params.id) {
      User
        .findOneAndDelete({ _id: req.params.id })
        .then(() => res.send({ deleted: 1 }))
        .catch(next);
    } else {
      res.send(new HttpError(403, 'Access denied'));
    }
  });
