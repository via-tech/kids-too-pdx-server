const nodemailer = require('nodemailer');

const configureMail = () => {
  return nodemailer.createTestAccount()
    .then(testAccount => {
      const { user, pass } = testAccount;
  
      const mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user,
          pass
        }
      };

      return nodemailer.createTransport(mailConfig);
    })
    .catch(error => {
      throw error;
    });
};

module.exports = { configureMail };
