const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');
const { activateOrg } = require('../middleware/activateOrg');
const { getOrgs } = require('../services/getOrgs');
const { deActivateOrg } = require('../middleware/deActivateOrg');

module.exports = Router()
  .get('/', getOrgs, (req, res) => {
    res.send(req.body.orgs);
  })

  .delete('/:id', ensureAuth([roles.ORG, roles.ADMIN]), authenticateUser(User), deActivateOrg, (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.params.id }, { role: 'inactive' }, { new: true })
      .then(user => res.send({
        user,
        token: user.authToken()
      }))
      .catch(next);
  })

  .post('/activate', activateOrg, (req, res, next) => {
    const { stripeToken, stripeSubId, user } = req.body;
    
    User
      .findByIdAndUpdate({ _id: user._id }, { role: 'org', stripeToken, stripeSubId }, { new: true })
      .then(user => res.send({
        user,
        token: user.authToken()
      }))
      .catch(next);
  });
