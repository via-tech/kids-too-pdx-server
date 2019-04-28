const roles = {
  ADMIN: 'admin',
  ORG: 'org'
};

const getAllRoles = () => Object.values(roles);

module.exports = {
  roles,
  getAllRoles
};
