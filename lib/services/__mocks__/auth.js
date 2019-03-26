const createOrg = user => Promise.resolve(user);

const deleteOrg = id => Promise.resolve({ deleted: id });

const getUsersByEmail = email => Promise.resolve({
  email,
  username: '1234',
  name: 'The Org'
});

module.exports = {
  createOrg,
  deleteOrg,
  getUsersByEmail
};
