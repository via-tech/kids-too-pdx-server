const { Router } = require('express');
const {
  createOrg,
  deleteOrg
} = require('../services/auth');

module.exports = Router()
  .post('/', (req, res, next) => {
    createOrg({ ...req.body })
      .then(user => res.send(user))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    deleteOrg(req.params.id)
      .then(res.send({ deleted: 1 }))
      .catch(next);
  });
