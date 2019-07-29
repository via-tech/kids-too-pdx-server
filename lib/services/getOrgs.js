const User = require('../models/User');

const getOrgs = (req, res, next) => {
  return User
    .find({ role: 'org' })
    .then(orgs => {
      req.body.orgs = orgs.map(org => ({ name: org.name, bio: org.bio, logo: org.logo }));
      next();
    })
    .catch(next);
};

module.exports = { getOrgs };
