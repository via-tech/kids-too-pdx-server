require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

describe('orgs routes', () => {
  let createdUsers = null;
  const createUser = (username, role = 'org') => User.create({
    role,
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
    .then(user => ({
      user: user.toJSON(),
      token: user.authToken()
    }))
    .catch(err => err);
    
  beforeAll(done => {
    connect(process.env.MONGODB_URI_TEST);
    Promise.all(['org0', 'org1', 'org2', 'org3', 'org4'].map(username => createUser(username)))
      .then(createdOrgs => {
        createdUsers = createdOrgs;
        done();
      });
  });

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('gets a list of all organizations, not all users', () => {
    return createUser('org5', 'inactive')
      .then(() =>
        request(app)
          .get('/orgs')
          .then(orgsRes => expect(orgsRes.body).toHaveLength(5))
      );
  });

  it('deletes organization by id', () => {
    const { user, token } = createdUsers[3];
    return request(app)
      .delete(`/orgs/${user._id}`)
      .send({ token })
      .then(deletedRes => expect(deletedRes.body).toEqual({ deleted: 1 }));
  });

  it('does not delete organization for wrong user', () => {
    const { user } = createdUsers[0];
    const { token } = createdUsers[1];
    return request(app)
      .delete(`/orgs/${user._id}`)
      .send({ token })
      .then(deletedRes => expect(deletedRes.body).toEqual({ code: 403, message: 'Access denied' }));
  });
});
