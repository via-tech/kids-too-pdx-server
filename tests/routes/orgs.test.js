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
    return createUser('admin5', 'The Admin', 'admin')
      .then(() =>
        request(app)
          .get('/orgs')
          .then(orgsRes => expect(orgsRes.body).toHaveLength(5))
      );
  });

  it('deletes organization by id as org', () => {
    const { token } = createdUsers[3];
    return request(app)
      .post('/orgs/activate')
      .send({
        token,
        stripeToken: 'tok_visa'
      })
      .then(activatedRes => {
        const { user, token } = activatedRes.body;
        return request(app)
          .delete(`/orgs/${user._id}`)
          .set('Authorization', `Bearer ${token}`)
          .then(deletedRes => expect(deletedRes.body).toEqual({
            ...user,
            role: 'inactive'
          }));
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

  it('activates an inactive user', () => {
    return createUser('inactiveOrg2', 'Inactive Org2', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;
        return request(app)
          .post('/orgs/activate')
          .send({
            token,
            stripeToken: 'tok_visa'
          })
          .then(activatedRes => expect(activatedRes.body).toEqual({
            user: {
              ...user,
              role: 'org',
              stripeToken: 'tok_visa',
              stripeSubId: expect.any(String)
            },
            token: expect.any(String)
          }));
      });
  });
});
