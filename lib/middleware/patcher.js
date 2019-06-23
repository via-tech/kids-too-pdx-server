const patcher = fieldsKey => (req, res, next) => {
  const { body } = req;
  const fields = {
    user: ['username', 'name', 'email', 'phone', 'address', 'password'],

    event: ['name', 'image', 'date', 'location', 'time', 'price', 'ageMin', 'ageMax', 'description', 'category', 'contact', 'reducedRate', 'website']
  };

  req.body.patched = Object.keys(body).reduce((acc, key) => {
    if(fields[fieldsKey].includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});

  next();
};

module.exports = { patcher };
