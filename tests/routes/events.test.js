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
});
