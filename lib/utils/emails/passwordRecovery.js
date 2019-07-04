require('dotenv').config();

module.exports = ({ email, name, password }) => {
  const html = `
    <p>Hello ${name},</p><br/>

    <p>You have requested a new password. Your new password is ${password}. You may change your password in profile settings after login.</p><br/>

    <p>Thank you!</p>
  `;

  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Recovery',
    html
  };
};
