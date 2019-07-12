const { Router } = require('express');
const Event = require('../models/Event');
const { ensureAuth } = require('../middleware/ensureAuth');
const { roles } = require('../models/roles');
const { authenticateUser } = require('../middleware/authenticateUser');
const { verifyEvent } = require('../middleware/verifyEvent');
const { patcher } = require('../middleware/patcher');
const { eventsFilters } = require('../services/eventsFilters');

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .then(events => res.send(events))
      .catch(next);
  })
  
  .post('/', ensureAuth([roles.ORG]), verifyEvent, (req, res, next) => {
    Event
      .create(req.body)
      .then(event => res.send(event.toJSON()))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Event
      .find({ _id: req.params.id })
      .then(events => res.send(events[0].toJSON()))
      .catch(next);
  })

  .get('/query/:q', eventsFilters, (req, res, next) => {
    Event
      .find({ $and: req.body.filtered })
      .then(events => res.send(events))
      .catch(next);
  })

  .patch('/:id', ensureAuth([roles.ORG]), authenticateUser(Event), patcher('event'), (req, res, next) => {
    Event
      .findOneAndUpdate({ _id: req.params.id }, req.body.patched, { new: true })
      .then(updatedEvent => res.send(updatedEvent))
      .catch(next);
  })

  .delete('/:id', ensureAuth([roles.ORG]), authenticateUser(Event), (req, res, next) => {
    Event
      .findOneAndDelete({ _id: req.params.id })
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });
