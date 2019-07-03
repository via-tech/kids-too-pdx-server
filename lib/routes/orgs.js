const { Router } = require('express');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');
const { verifyUser } = require('../middleware/verifyUser');
const { activateUser } = require('../middleware/activateUser');

module.exports = Router()
  .get('/', (req, res, next) => {
    User
      .find({ role: 'org' })
      .then(orgs => {
        const orgsCleaned = orgs.map(org => ({ name: org.name, bio: org.bio, logo: org.logo }));
        res.send(orgsCleaned);
      })
      .catch(next);
  })

  .delete('/:id', ensureAuth([roles.ORG, roles.ADMIN]), authenticateUser(User), (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.params.id }, { role: 'inactive' }, { new: true })
      .then(inactive => res.send(inactive))
      .catch(next);
  })

  .post('/activate', verifyUser, activateUser, (req, res, next) => {
    User
      .findByIdAndUpdate({ _id: req.body.user._id }, { role: 'org' }, { new: true })
      .then(activeUser => res.send(activeUser))
      .catch(next);
  });
