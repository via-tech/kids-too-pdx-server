const { hash } = require('../utils/hash');

const patcher = fieldsKey => (req, res, next) => {
  const { body } = req;
  const fields = {
    user: ['username', 'name', 'email', 'phone', 'address', 'password'],

    event: ['name', 'image', 'date', 'location', 'time', 'price', 'ageMin', 'ageMax', 'description', 'category', 'contact', 'reducedRate', 'website']
  };

  const patched = Object.keys(body).reduce((acc, key) => {
    if(fields[fieldsKey].includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});

  if(patched.password) {
    hash(patched.password)
      .then(hashedPassword => {
        patched.passwordHash = hashedPassword;
        req.body.patched = patched;
        next();
      });
  } else {
    req.body.patched = patched;
    next();
  }
};

module.exports = { patcher };
