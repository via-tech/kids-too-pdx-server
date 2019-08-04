const { createUser } = require('../dataHelper');
const request = require('supertest');
const app = require('../../lib/app');
const Activate = require('../../lib/models/Activate');

jest.mock('../../lib/services/emails/configureMail');

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

  it('deletes organization by id as org', done => {
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
          .then(deletedRes => {
            expect(deletedRes.body).toEqual({
              user: {
                ...user,
                role: 'inactive'
              },
              token: expect.any(String)
            });

            done();
          });
      });
  }, 10000);

  it('does not delete organization for wrong user', () => {
    const { user } = createdUsers[0];
    const { token } = createdUsers[1];

    return request(app)
      .delete(`/orgs/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(deletedRes => expect(deletedRes.body).toEqual({ error: 'Access denied' }));
  });

  it('submits payment for an inactive user', done => {
    return createUser('inactiveOrg2', 'Inactive Org2', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;

        return request(app)
          .post('/orgs/activate')
          .send({
            token,
            stripeToken: 'tok_visa'
          })
          .then(activatedRes => {
            expect(activatedRes.body).toEqual({
              user: {
                ...user,
                stripeToken: 'tok_visa',
                stripeSubId: expect.any(String)
              },
              token: expect.any(String),
              previewUrl: expect.any(String)
            });

            done();
          });
      });
  }, 10000);

  it('verifies email, activates user and deletes activation code', done => {
    return createUser('inactiveOrg3', 'Inactive Org3', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;

        return request(app)
          .post('/orgs/activate')
          .send({
            token,
            stripeToken: 'tok_visa',
            adminPassCode: process.env.ADMIN_PASS_CODE
          })
          .then(activeRes => {
            const { code } = activeRes.body;

            return request(app)
              .get(`/orgs/verify-email?userId=${user._id}&code=${code}`)
              .then(verifiedRes => {
                expect(verifiedRes.body).toEqual({
                  user: {
                    ...user,
                    role: 'org',
                    stripeToken: 'tok_visa',
                    stripeSubId: expect.any(String)
                  },
                  token: expect.any(String),
                  actId: expect.any(String)
                });

                Activate
                  .findOne({ _id: verifiedRes.body.actId })
                  .then(act => {
                    expect(act).toEqual(null);
                    
                    done();
                  })
                  .catch(err => err);
              });
          });
      });
  }, 10000);

  it('errors on missing verification fields', done => {
    return createUser('inactiveOrg4', 'Inactive Org4', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;

        return request(app)
          .post('/orgs/activate')
          .send({
            token,
            stripeToken: 'tok_visa',
            adminPassCode: process.env.ADMIN_PASS_CODE
          })
          .then(() => {
            return request(app)
              .get(`/orgs/verify-email?userId=${user._id}&code=`)
              .then(verifiedRes => {
                expect(verifiedRes.body).toEqual({
                  error: {
                    message: 'Verification failed: Missing verification fields'
                  }
                });

                done();
              });
          });
      });
  }, 10000);

  it('errors on failed verification', done => {
    return createUser('inactiveOrg5', 'Inactive Org5', 'inactive')
      .then(inactiveRes => {
        const { token } = inactiveRes.body;

        return request(app)
          .post('/orgs/activate')
          .send({
            token,
            stripeToken: 'tok_visa',
            adminPassCode: process.env.ADMIN_PASS_CODE
          })
          .then(activeRes => {
            const { code } = activeRes.body;

            return request(app)
              .get(`/orgs/verify-email?userId=12345&code=${code}`)
              .then(verifiedRes => {
                const { body } = verifiedRes;
                const { actId } = body.error;

                expect(body).toEqual({
                  error: {
                    message: 'Verification failed',
                    actId
                  }
                });

                Activate
                  .findOne({ _id: actId })
                  .then(act => {
                    expect(act).toBeDefined();
                    
                    done();
                  })
                  .catch(err => err);
              });
          });
      });
  }, 10000);
});
