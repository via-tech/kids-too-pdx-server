require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const request = require('supertest');
const app = require('../lib/app');

beforeAll(() => connect(process.env.MONGODB_URI_TEST));

afterAll(done => {
  mongoose.connection.dropDatabase()
    .then(() => mongoose.connection.close(done));
});

const createUser = (username, name = 'The Org', role = 'org') => {
  return request(app)
    .post('/auth/signup')
    .send({
      role,
      adminPassCode: process.env.ADMIN_PASS_CODE,
      username,
      password: 'passit',
      name,
      email: `${username}@email.com`,
      phone: '555-123-4567',
      address: {
        street: '123 Main St.',
        city: 'Portland',
        state: 'OR',
        zipcode: '97203'
      }
    })
    .catch(err => err);
};

const createEvent = (eventName, user) => {
  return request(app)
    .post('/events')
    .set('Authorization', `Bearer ${user.token}`)
    .send({
      name: eventName,
      image: 'image.com',
      date: Date.now(),
      description: 'An event hosted by The Org',
      category: 'arts',
      ageMin: 2,
      ageMax: 14,
      price: 100,
      liability: true
    })
    .catch(err => err);
};

module.exports = {
  createUser,
  createEvent
};
