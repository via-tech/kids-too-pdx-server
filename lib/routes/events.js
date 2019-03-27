const { Router } = require('express');
const Event = require('../models/Event');
const { parse } = require('url');
// const ensureAuth = require('../middleware/ensureAuth');


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

module.exports = Router()
  .get('/', (req, res, next) => {
    Event
      .find()
      .then(events => res.send(events))
      .catch(next);
  })
  
  .post('/', (req, res, next) => {
    Event
      .create(req.body)
      .then(event => res.send(event.toJSON()))
      .catch(next);
  })

  .get('/:query', (req, res, next) => {
    const { query } = parse(req.url, true);
    Event
      .find({ $and: eventsFilters(query) })
      .then(events => res.send(events))
      .catch(next);
  });
