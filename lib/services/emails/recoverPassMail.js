require('dotenv').config();

module.exports = ({ email, name, password }) => {
  const html = `
    <p>Hello ${name},</p>

    <p>You have requested a new password. Your new password is ${password}. You may change your password in profile settings after login.</p>

    <p>Thank you!</p>
  `;

  return {
    from: 'Kids2 <donotreply@viamt.com>',
    replyTo: 'donotreply@viamt.com',
    to: email,
    subject: 'Password Recovery',
    html
  };
};
