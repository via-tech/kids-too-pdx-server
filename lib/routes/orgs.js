const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .get('/', (req, res, next) => {
    User
      .find()
      .then(orgs => res.send(orgs))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    User
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
