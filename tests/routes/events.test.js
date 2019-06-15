const { createUser, createEvent } = require('../dataHelper');
const request = require('supertest');
const app = require('../../lib/app');

describe('event routes', () => {
  let currentUser = null;

  beforeAll(done => {
    createUser('org123')
      .then(userRes => {
        currentUser = userRes.body;
        done();
      });
  });

  it('posts an event', () => {
    return createEvent('The Org Event', currentUser)
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
        liability: true,
        user: currentUser.user._id
      }));
  });

  it('denies event with invalid age range', () => {
    return request(app)
      .post('/events')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .send({
        user: currentUser.user._id,
        ageMin: 5,
        ageMax: 500,
        liability: true
      })
      .then(res => expect(res.body).toEqual({ error: 'Invalid age range' }));
  });

  it('denies event without liability', () => {
    return request(app)
      .post('/events')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .send({
        user: currentUser.user._id,
        ageMin: 5,
        ageMax: 10,
        liability: false
      })
      .then(res => expect(res.body).toEqual({ error: 'Liability agreement required' }));
  });

  it('filters an event', () => {
    return request(app)
      .get('/events/query/q?ageMin=1&ageMax=15&price=100')
      .then(res => expect(res.body).toHaveLength(1));
  });

  it('gets all events', () => {
    return request(app)
      .get('/events')
      .then(res => expect(res.body).toHaveLength(1));
  });

  it('gets event by id', () => {
    return createEvent('The Other Event', currentUser)
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
            liability: true,
            _id: expect.any(String)
          }));
      });
  });

  it('updates price of an event', () => {
    return createEvent('The Other Other Event', currentUser)
      .then(eventRes => {
        return request(app)
          .patch(`/events/${eventRes.body._id}`)
          .set('Authorization', `Bearer ${currentUser.token}`)
          .send({
            price: 200
          })
          .then(patchedEvent => expect(patchedEvent.body.price).toEqual(200));
      });
  });

  it('denies event update by wrong user', () => {
    return createEvent('The Right Event', currentUser)
      .then(newEvent => {
        return createUser('thewronguser')
          .then(newUser => {
            return request(app)
              .patch(`/events/${newEvent.body._id}`)
              .set('Authorization', `Bearer ${newUser.body.token}`)
              .send({
                price: 1
              })
              .then(patchedEvent => expect(patchedEvent.body).toEqual({ error: 'Access denied' }));
          });
      });
  });

  it('deletes an event', () => {
    return createEvent('The Deleteable Event', currentUser)
      .then(newEvent => {
        return request(app)
          .delete(`/events/${newEvent.body._id}`)
          .set('Authorization', `Bearer ${currentUser.token}`)
          .then(deletedRes => expect(deletedRes.body).toEqual({ deleted: 1 }));
      });
  });
});
