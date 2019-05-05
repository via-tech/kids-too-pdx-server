const { Router } = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { parse } = require('url');
const { ensureAuth } = require('../middleware/ensureAuth');
const { HttpError } = require('../middleware/error');
const { roles } = require('../models/roles');

const eventsFilters = query => {
  return Object.keys(query).map(key => {
    const value = query[key];
    if(key === 'ageMin') return ({ ageMin: { $eq: parseInt(value) } });
    if(key === 'ageMax') return ({ ageMax: { $lte: parseInt(value) } });
    if(key === 'price') return ({ price: { $lte: parseInt(value) } });
    if(key === 'category') return ({ category: value });
    return {};
  });
};

const patcher = (body, fields) => {
  return Object.keys(body).reduce((acc, key) => {
    if(fields.includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});
};

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .then(events => res.send(events))
      .catch(next);
  })
  
  .post('/', ensureAuth([roles.ORG]), (req, res, next) => {
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

  .get('/query/:q', (req, res, next) => {
    const { query } = parse(req.url, true);
    Event
      .find({ $and: eventsFilters(query) })
      .then(events => res.send(events))
      .catch(next);
  })

  .patch('/:id', ensureAuth([roles.ORG]), (req, res, next) => {
    const patched = patcher(req.body, ['name', 'image', 'date', 'location', 'time', 'price', 'ageMin', 'ageMax', 'description', 'category', 'contact', 'reducedRate', 'website']);

    User
      .findByToken(req.body.token)
      .then(tokenUser => {
        Event
          .findById(req.params.id)
          .then(foundEvent => {
            if(foundEvent.user === tokenUser._id) {
              Event
                .findOneAndUpdate({ _id: req.params.id }, patched, { new: true })
                .then(updatedEvent => res.send(updatedEvent))
                .catch(next);
            } else {
              res.send(new HttpError(403, 'Access denied'));
            }
          });
      });
  });
