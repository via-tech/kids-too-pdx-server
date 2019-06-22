const { createHttpError } = require('./error');

const chargeCard = ({ paymentInfo, amount }) => {
  return Promise.resolve({ paymentInfo, amount });
};

const validatePayment = payment => {
  if(!payment) return false;

  const { cardNumber, cardName, expMonth, expYear, securityCode, method, billAddress } = payment;

  if(!billAddress) return false;

  const { billStreet, billCity, billState, billZipcode } = billAddress;

  const requiredFields = [cardNumber, cardName, expMonth, expYear, securityCode, method, billStreet, billCity, billState, billZipcode];

  return !requiredFields.includes(undefined);

};

const activateUser = (req, res, next) => {
  const { payment } = req.body;
  
  if(!validatePayment(payment)) return next(createHttpError(401, 'Missing payment information'));

  return chargeCard({ paymentInfo: payment, amount: 1 })
    .then(chargeSuccess => {
      if(!chargeSuccess) return next(createHttpError(401, 'Payment unsuccessful. Please ensure card information is correct'));

      return next();
    })
    .catch(next);
};

module.exports = { activateUser };
