require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

describe('orgs routes', () => {
  let createdUsers = null;
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
    
  beforeAll(done => {
    connect(process.env.MONGODB_URI_TEST);
    Promise.all(['org0', 'org1', 'org2', 'org3', 'org4'].map(username => createUser(username)))
      .then(createdOrgs => {
        createdUsers = createdOrgs;
        console.log('createdUsers', createdUsers);
        done();
      });
  });

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('gets a list of all organizations', () => {
    return request(app)
      .get('/orgs')
      .then(orgsRes => expect(orgsRes.body).toHaveLength(5));
  });
});
