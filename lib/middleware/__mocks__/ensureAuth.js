module.exports = () => (req, res, next) => {
  req.user = {
    role: 'org',
    username: 'testOrg'
  };

  next();
};
