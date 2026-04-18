// Vercel Serverless Function: Customer Portal
// Creates a Stripe billing portal session for managing subscriptions
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers - restrict to app domain
  const allowedOrigin = process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app/premium',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return res.status(500).json({ error: error.message });
  }
}
