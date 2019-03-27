require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');

jest.mock('../../lib/services/auth.js');
describe('event routes', () => {
  beforeAll(() => connect());

  afterAll(() => mongoose.connection.close());

  it('posts an event', () => {
    return request(app)
      .post('/events')
      .send({
        user: '1234',
        name: 'The Org Event',
        image: 'image.com',
        date: Date.now(),
        description: 'An event hosted by The Org',
        category: 'arts',
        ageMin: 2,
        ageMax: 14,
        price: 100
      })
      .then(res => expect(res.body).toEqual({
        _id: expect.any(String),
        __v: expect.any(Number),
        user: '1234',
        name: 'The Org Event',
        image: 'image.com',
        date: expect.any(String),
        description: 'An event hosted by The Org',
        category: 'arts',
        ageMin: 2,
        ageMax: 14,
        price: 100,
        pending: true
      }));
  });

  it('filters an event', () => {
    return request(app)
      .get('/events/query?ageMin=2&ageMax=14&price=100')
      .then(res => expect(res.body).toBeDefined());
  });

  it('gets all events', () => {
    return request(app)
      .get('/events')
      .then(res => expect(res.body).toBeDefined());
  });

  it('gets event by id', () => {
    return request(app)
      .post('/events')
      .send({
        user: '123456',
        pending: false,
        name: 'The Event',
        image: 'image.com',
        date: Date.now(),
        price: 100,
        ageMin: 2,
        ageMax: 8
      })
      .then(createdRes => {
        return request(app)
          .get(`/events/${createdRes.body._id}`)
          .then(getRes => expect(getRes.body).toEqual({
            user: '123456',
            pending: false,
            name: 'The Event',
            image: 'image.com',
            date: expect.any(String),
            price: 100,
            ageMin: 2,
            ageMax: 8,
            _id: expect.any(String),
            __v: expect.any(Number)
          }));
      });
  });

  it('gets pending events', () => {
    return request(app)
      .get('/events/pending')
      .then(res => expect(res.body).toBeDefined());
  });

  it('gets approved events', () => {
    return request(app)
      .get('/events/approved')
      .then(res => expect(res.body).toBeDefined());
  });
});
