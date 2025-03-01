// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { priceId } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       mode: 'subscription',
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${req.headers.origin}/purchase`,
//     });

//     res.status(200).json({ sessionId: session.id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }