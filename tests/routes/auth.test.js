require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

describe('auth routes', () => {
  const createUser = username => User.create({
    role: 'org',
    username,
    password: 'passit',
    name: 'The Org',
    email: 'theorg@email.com',
    phone: '555-123-4567',
    address: {
      street: '123 Main St.',
      city: 'Portland',
      state: 'OR',
      zip: '97203'
    }
  })
    .catch(err => err);

  beforeAll(() => connect());

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('sings up an organization', () => {
    return request(app)
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
      .then(res => expect(res.body).toEqual({
        user: {
          _id: expect.any(String),
          role: 'org',
          username: 'org2123',
          name: 'The Org2',
          email: 'theorg2@email.com',
          phone: '555-123-4568',
          address: {
            street: '124 Main St.',
            city: 'Portland',
            state: 'OR',
            zip: '97203'
          }
        },
        token: expect.any(String)
      }));
  });

  it('signs in to an org', () => {
    return createUser('org123')
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({
            username: 'org123',
            password: 'passit'
          })
          .then(res => expect(res.body).toEqual({
            user: {
              _id: expect.any(String),
              role: 'org',
              username: 'org123',
              name: 'The Org',
              email: 'theorg@email.com',
              phone: '555-123-4567',
              address: {
                street: '123 Main St.',
                city: 'Portland',
                state: 'OR',
                zip: '97203'
              },
            },
            token: expect.any(String)
          }));
      });
  });
});
