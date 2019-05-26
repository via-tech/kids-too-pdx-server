require('../dataHelper');
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

describe('auth routes', () => {
  let currentUser = null;
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
    createUser('org1234')
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({
            username: 'org1234',
            password: 'passit'
          })
          .then(userRes => {
            currentUser = userRes.body;
            done();
          });
      });
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
              }
            },
            token: expect.any(String)
          }));
      });
  });

  it('updates user info', () => {
    return request(app)
      .patch(`/auth/${currentUser.user._id}`)
      .set('Authorization', `Bearer ${currentUser.token}`)
      .send({
        username: 'orgChanged',
        role: 'admin',
        name: 'Changed Org',
        email: 'thechangedorg@email.com',
        phone: '555-111-2222',
        address: {
          street: '456 Main St.',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210'
        }
      })
      .then(patchRes => expect(patchRes.body).toEqual({
        _id: expect.any(String),
        role: 'org',
        username: 'orgChanged',
        name: 'Changed Org',
        email: 'thechangedorg@email.com',
        phone: '555-111-2222',
        address: {
          street: '456 Main St.',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210'
        }
      }));
  });

  it('does not update role', () => {
    return request(app)
      .patch(`/auth/${currentUser.user._id}`)
      .set('Authorization', `Bearer ${currentUser.token}`)
      .send({
        role: 'admin'
      })
      .then(patchRes => expect(patchRes.body).toEqual({
        _id: expect.any(String),
        role: 'org',
        username: 'orgChanged',
        name: 'Changed Org',
        email: 'thechangedorg@email.com',
        phone: '555-111-2222',
        address: {
          street: '456 Main St.',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210'
        }
      }));
  });

  it('updates password', () => {
    return request(app)
      .patch(`/auth/${currentUser.user._id}`)
      .set('Authorization', `Bearer ${currentUser.token}`)
      .send({
        password: 'changedPass'
      })
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({
            username: 'orgChanged',
            password: 'changedPass'
          })
          .then(userRes => expect(userRes.body).toEqual({
            user: {
              _id: expect.any(String),
              role: 'org',
              username: 'orgChanged',
              name: 'Changed Org',
              email: 'thechangedorg@email.com',
              phone: '555-111-2222',
              address: {
                street: '456 Main St.',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90210'
              }
            },
            token: expect.any(String)
          }));
      });
  });

  it('does not update the wrong user', () => {
    return request(app)
      .post('/auth/signup')
      .send({
        role: 'org',
        username: 'hacker123',
        password: 'hackpass',
        phone: '503-888-9999',
        email: 'hackeremail@email.com'
      })
      .then(hackerUser => {
        return request(app)
          .patch(`/auth/${currentUser.user._id}`)
          .set('Authorization', `Bearer ${hackerUser.body.token}`)
          .send({
            name: 'Hacker Org',
            phone: '503-555-1234',
            username: 'hackerOrg'
          })
          .then(patchedRes => expect(patchedRes.body).toEqual({ error: 'Access denied' }));
      });
  });
});
