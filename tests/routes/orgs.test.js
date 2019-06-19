const { createUser } = require('../dataHelper');
const request = require('supertest');
const app = require('../../lib/app');

describe('orgs routes', () => {
  let createdUsers = null;
  
  beforeAll(done => {
    Promise.all(['org0', 'org1', 'org2', 'org3', 'org4'].map(username => createUser(username)))
      .then(createdOrgsRes => {
        createdUsers = createdOrgsRes.map(org => org.body);
        done();
      });
  });

  it('gets a list of all organizations, not all users', () => {
    return createUser('org5', 'The Org5', 'inactive')
      .then(() =>
        request(app)
          .get('/orgs')
          .then(orgsRes => expect(orgsRes.body).toHaveLength(5))
      );
  });

  it('deletes organization by id as org', () => {
    const { user, token } = createdUsers[3];
    return request(app)
      .delete(`/orgs/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(deletedRes => expect(deletedRes.body).toEqual({
        ...user,
        role: 'inactive'
      }));
  });

  it('deletes organization by id as admin', () => {
    return createUser('admin1', 'The Admin', 'admin')
      .then(userRes => {
        return request(app)
          .delete(`/orgs/${createdUsers[3].user._id}`)
          .set('Authorization', `Bearer ${userRes.body.token}`)
          .then(deletedRes => expect(deletedRes.body).toEqual({ deleted: 1 }));
      });
  });

  it('does not delete organization for wrong user', () => {
    const { user } = createdUsers[0];
    const { token } = createdUsers[1];
    return request(app)
      .delete(`/orgs/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(deletedRes => expect(deletedRes.body).toEqual({ error: 'Access denied' }));
  });
});
