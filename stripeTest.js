// require('dotenv').config();
// const stripe = Stripe(process.env.STRIP_PUB_TEST);

// const card = {
//   object: 'card',
//   number: '4000000000003220',
//   exp_month: 8,
//   exp_year: 2020,
//   cvc: 121
// };

// stripe.createToken(card)
//   .then(res => console.log('res', res));

// // const stripe = require('stripe')(process.env.STRIPE_KEY_TEST);

// // let customer = null;
// // let sub = null;

// // const createCust = () => {
// //   return stripe.customers.create({
// //     description: 'Customer for shabavid',
// //     email: 'shabavid@gmail.com',
// //     source: 'tok_visa'
// //   })
// //     .then(custRes => {
// //       customer = custRes;
// //       console.log('customer', customer);
// //     })
// //     .catch(err => console.log('err', err));
// // };

// // const createSub = () => {
// //   return stripe.subscriptions.create({
// //     customer: customer.id,
// //     items: [
// //       {
// //         plan: 'plan_FNh4uYKYf5UsGx'
// //       }
// //     ]
// //   })
// //     .then(subRes => {
// //       sub = subRes;
// //       console.log('sub', sub);
// //     })
// //     .catch(err => console.log('err', err));
// // };

// // createCust()
// //   .then(() => createSub());
