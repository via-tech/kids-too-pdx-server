const roles = {
  ADMIN: 'admin',
  ORG: 'org',
  INACTIVE: 'inactive'
};

const getAllRoles = () => Object.values(roles);

module.exports = {
  roles,
  getAllRoles
};
