require('../dataHelper');
const User = require('../../lib/models/User');

describe('User model', () => {
  it('creates a user', () => {
    return User.create({
      role: 'org',
      username: 'theOrg123',
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
      .then(user => expect(user.toJSON()).toEqual({
        _id: expect.any(Object),
        role: 'org',
        username: 'theOrg123',
        name: 'The Org',
        email: 'theorg@email.com',
        phone: '555-123-4567',
        address: {
          street: '123 Main St.',
          city: 'Portland',
          state: 'OR',
          zip: '97203'
        }
      }));
  });
});
