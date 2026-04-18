// Vercel Serverless Function: Stripe Webhook Handler
// Handles subscription events from Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase admin client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout completed:', session.id);
        
        // Update user's subscription in Supabase
        if (session.client_reference_id) {
          const { error } = await supabase
            .from('user_profiles')
            .update({
              subscription_tier: session.metadata?.tier || 'premium',
              subscription_status: 'active',
              stripe_customer_id: session.customer,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', session.client_reference_id);
            
          if (error) {
            console.error('Failed to update user profile:', error);
            throw error;
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const tier = subscription.metadata?.tier || 'premium';
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        console.log(`Subscription ${event.type}:`, {
          subscriptionId: subscription.id,
          customerId,
          tier,
          status: subscription.status,
        });

        // Find user by stripe_customer_id and update subscription
        const { error } = await supabase
          .from('user_profiles')
          .update({
            subscription_tier: isActive ? tier : 'free',
            subscription_status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId);
          
        if (error) {
          console.error('Failed to update subscription:', error);
          throw error;
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        console.log('Subscription deleted:', subscription.id);
        
        // Downgrade user to free tier
        const { error } = await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', customerId);
          
        if (error) {
          console.error('Failed to cancel subscription:', error);
          throw error;
        }
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Invoice paid:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Invoice payment failed:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
