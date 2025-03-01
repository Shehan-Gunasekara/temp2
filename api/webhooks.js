// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       webhookSecret
//     );
//   } catch (err) {
//     return res.status(400).json({ message: `Webhook Error: ${err.message}` });
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'customer.subscription.created':
//       const subscription = event.data.object;
//       // Handle new subscription
//       await handleNewSubscription(subscription);
//       break;
//     case 'customer.subscription.updated':
//       // Handle subscription update
//       break;
//     case 'customer.subscription.deleted':
//       // Handle subscription cancellation
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// }

// async function handleNewSubscription(subscription) {
//   // Add your subscription handling logic here
//   // For example, update user's subscription status in your database
//   console.log('New subscription:', subscription.id);
// }