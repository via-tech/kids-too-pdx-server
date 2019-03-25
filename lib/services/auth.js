require('dotenv').config();
const { ManagementClient } = require('auth0');

const auth0 = new ManagementClient({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  scope: 'read:users delete:users create:users'
});

const getOrg = id => auth0.getUser({ id });

const createOrg = user => auth0
  .createUser({ ...user, connection: 'Username-Password-Authentication' });

const deleteOrg = id => auth0.deleteUser({ id });

module.exports = {
  getOrg,
  createOrg,
  deleteOrg
};
