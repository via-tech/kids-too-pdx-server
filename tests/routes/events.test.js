require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');

describe('event routes', () => {
  let currentUser = null;

  beforeAll(done => {
    connect(process.env.MONGODB_URI_TEST);
    request(app)
      .post('/auth/signup')
      .send({
        role: 'org',
        username: 'org2123',
        password: 'passit2',
        name: 'The Org2',
        email: 'theorg2@email.com',
        phone: '555-123-4568',
        address: {
          street: '124 Main St.',
          city: 'Portland',
          state: 'OR',
          zip: '97203'
        }
      })
      .then(res => {
        currentUser = res.body;
        done();
      });
  });

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('posts an event', () => {
    return request(app)
      .post('/events')
      .send({
        name: 'The Org Event',
        image: 'image.com',
        date: Date.now(),
        description: 'An event hosted by The Org',
        category: 'arts',
        ageMin: 2,
        ageMax: 14,
        price: 100,
        token: currentUser.token
      })
      .then(res => expect(res.body).toEqual({
        _id: expect.any(String),
        name: 'The Org Event',
        image: 'image.com',
        date: expect.any(String),
        description: 'An event hosted by The Org',
        category: 'arts',
        ageMin: 2,
        ageMax: 14,
        price: 100,
        user: expect.any(String)
      }));
  });

  it('filters an event', () => {
    return request(app)
      .get('/events/query/q?ageMin=2&ageMax=14&price=100')
      .then(res => expect(res.body).toHaveLength(1));
  });

  it('gets all events', () => {
    return request(app)
      .get('/events')
      .then(res => expect(res.body).toHaveLength(1));
  });

  it('gets event by id', () => {
    return request(app)
      .post('/events')
      .send({
        name: 'The Other Event',
        image: 'image.com',
        date: Date.now(),
        price: 100,
        ageMin: 2,
        ageMax: 8,
        token: currentUser.token
      })
      .then(createdRes => {
        return request(app)
          .get(`/events/${createdRes.body._id}`)
          .then(getRes => expect(getRes.body).toEqual({
            user: currentUser.user._id,
            name: 'The Other Event',
            image: 'image.com',
            date: expect.any(String),
            price: 100,
            ageMin: 2,
            ageMax: 8,
            _id: expect.any(String)
          }));
      });
  });

  it('updates price of an event', () => {
    return request(app)
      .post('/events')
      .send({
        name: 'The Other Other Event',
        image: 'image.com',
        date: Date.now(),
        price: 100,
        ageMin: 12,
        ageMax: 18,
        token: currentUser.token
      })
      .then(eventRes => {
        return request(app)
          .patch(`/events/${eventRes.body._id}`)
          .send({
            price: 200,
            token: currentUser.token,
            user: eventRes.user
          })
          .then(updatedEvent => expect(updatedEvent.body.price).toEqual(200));
      });
  });
});
