require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const User = require('../../lib/models/User');

describe('User model', () => {
  beforeAll(() => connect());

  afterAll(done => {
    mongoose.connection.dropDatabase()
      .then(() => mongoose.connection.close(done));
  });

  it('creates a user', () => {
    return User.create({
      role: 'org',
      username: 'theOrg123',
      password: 'passit'
    })
      .then(user => expect(user.toJSON()).toEqual({
        _id: expect.any(Object),
        role: 'org',
        username: 'theOrg123'
      }));
  });
});
