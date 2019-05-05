require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');

describe('event routes', () => {
  let currentUser = null;

  const signupUser = username => {
    return request(app)
      .post('/auth/signup')
      .send({
        role: 'org',
        username,
        password: 'passit',
        name: 'The Wrong Org',
        email: `${username}@email.com`,
        phone: '555-123-4569',
        address: {
          street: '125 Main St.',
          city: 'Portland',
          state: 'OR',
          zip: '97203'
        }
      });
  };

  const createEvent = eventName => {
    return request(app)
      .post('/events')
      .send({
        name: eventName,
        image: 'image.com',
        date: Date.now(),
        description: 'An event hosted by The Org',
        category: 'arts',
        ageMin: 2,
        ageMax: 14,
        price: 100,
        token: currentUser.token
      });
  };

  beforeAll(done => {
    connect(process.env.MONGODB_URI_TEST);
    signupUser('org123')
      .then(userRes => {
        currentUser = userRes.body;
        done();
      });
  });

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('posts an event', () => {
    return createEvent('The Org Event')
      .then(eventRes => expect(eventRes.body).toEqual({
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
    return createEvent('The Other Event')
      .then(createdRes => {
        return request(app)
          .get(`/events/${createdRes.body._id}`)
          .then(getRes => expect(getRes.body).toEqual({
            user: currentUser.user._id,
            name: 'The Other Event',
            image: 'image.com',
            date: expect.any(String),
            description: 'An event hosted by The Org',
            category: 'arts',
            ageMin: 2,
            ageMax: 14,
            price: 100,
            _id: expect.any(String)
          }));
      });
  });

  it('updates price of an event', () => {
    return createEvent('The Other Other Event')
      .then(eventRes => {
        return request(app)
          .patch(`/events/${eventRes.body._id}`)
          .send({
            price: 200,
            token: currentUser.token
          })
          .then(patchedEvent => expect(patchedEvent.body.price).toEqual(200));
      });
  });

  it('denies event update by wrong user', () => {
    return createEvent('The Right Event')
      .then(newEvent => {
        return signupUser('thewronguser')
          .then(newUser => {
            return request(app)
              .patch(`/events/${newEvent.body._id}`)
              .send({
                price: 1,
                token: newUser.body.token
              })
              .then(patchedEvent => expect(patchedEvent.body).toEqual({ code: 403, message: 'Access denied' }));
          });
      });
  });
});
