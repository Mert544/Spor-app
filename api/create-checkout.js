// Vercel Serverless Function: Create Stripe Checkout Session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, tier, userId } = req.body;

    // Validate tier
    const validTiers = ['premium_monthly', 'premium_yearly', 'coach_monthly'];
    if (!validTiers.some(t => priceId.includes(t))) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app'}/premium?success=true`,
      cancel_url: `${process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app'}/premium?canceled=true`,
      customer_email: req.body.email || undefined,
      client_reference_id: userId || undefined,
      metadata: {
        tier: tier,
      },
      subscription_data: {
        metadata: {
          tier: tier,
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: error.message });
  }
}
