const { createUser } = require('../dataHelper');
const request = require('supertest');
const app = require('../../lib/app');
const Activate = require('../../lib/models/Activate');

jest.mock('../../lib/services/emails/configureMail');
jest.mock('../../lib/middleware/activateOrg');

const submitPayment = ({ token }) => {
  return request(app)
    .post('/activate/payment')
    .send({
      token,
      stripeToken: 'tok_visa'
    })
    .catch(err => err);
};

describe('activate routes', () => {
  it('submits payment for an inactive user', done => {
    return createUser('inactiveOrg2', 'Inactive Org2', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;

        return submitPayment({ token })
          .then(activatedRes => {
            expect(activatedRes.body).toEqual({
              user: {
                ...user,
                stripeToken: 'tok_visa',
                stripeSubId: expect.any(String)
              },
              token: expect.any(String),
              previewUrl: expect.any(String),
              code: expect.any(String)
            });

            done();
          });
      });
  }, 10000);

  it('verifies email, activates user and deletes activation code', done => {
    return createUser('inactiveOrg3', 'Inactive Org3', 'inactive')
      .then(inactiveRes => {
        const { user, token } = inactiveRes.body;

        return submitPayment({ token })
          .then(activeRes => {
            const { code } = activeRes.body;

            return request(app)
              .post(`/activate/verify-email?userId=${user._id}&code=${code}`)
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

        return submitPayment({ token })
          .then(() => {
            return request(app)
              .post(`/activate/verify-email?userId=${user._id}&code=`)
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

        return submitPayment({ token })
          .then(activeRes => {
            const { code } = activeRes.body;

            return request(app)
              .post(`/activate/verify-email?userId=12345&code=${code}`)
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
