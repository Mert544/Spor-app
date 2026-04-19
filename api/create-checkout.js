// Vercel Serverless Function: Create Stripe Checkout Session
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers - restrict to app domain
  const allowedOrigin = process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

    // Validate price ID against known Stripe Price IDs
    const VALID_PRICE_IDS = [
      process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID,
      process.env.STRIPE_COACH_MONTHLY_PRICE_ID,
    ].filter(Boolean);
    
    if (!VALID_PRICE_IDS.includes(priceId)) {
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
      success_url: `${process.env.VERCEL_URL || 'https://vtaper-coach.vercel.app'}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
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
