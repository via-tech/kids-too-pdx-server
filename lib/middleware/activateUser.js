const chargeCard = ({ paymentInfo, amount }) => {
  return Promise.resolve({ paymentInfo, amount });
};

const activateUser = (req, res, next) => {
  const { role, payment } = req.body;

  return chargeCard({ paymentInfo: payment, amount: 1 })
    .then(() => {
      if(role === 'inactive') req.body.role = 'org';
      return next();
    })
    .catch(next);
};

module.exports = { activateUser };
