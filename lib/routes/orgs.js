const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');
const { activateUser } = require('../middleware/activateUser');
const { patchOrgs } = require('../middleware/patcher');

module.exports = Router()
  .get('/', patchOrgs, (req, res) => {
    res.send(req.body.orgs);
  })

  .delete('/:id', ensureAuth([roles.ORG, roles.ADMIN]), authenticateUser(User), (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.params.id }, { role: 'inactive' }, { new: true })
      .then(inactive => res.send(inactive))
      .catch(next);
  })

  .post('/activate', activateUser, (req, res, next) => {
    const { stripeToken, user } = req.body;
    
    User
      .findByIdAndUpdate({ _id: user._id }, { role: 'org', stripeToken }, { new: true })
      .then(activeUser => res.send(activeUser))
      .catch(next);
  });
