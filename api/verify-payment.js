// Vercel Serverless Function: Verify Stripe Payment
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id required' });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Verify payment status
    const isPaid = session.payment_status === 'paid';
    const isComplete = session.status === 'complete';

    if (isPaid && isComplete) {
      return res.status(200).json({
        verified: true,
        tier: session.metadata?.tier || 'premium',
        customerId: session.customer,
      });
    } else {
      return res.status(200).json({
        verified: false,
        status: session.status,
        paymentStatus: session.payment_status,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: error.message });
  }
}