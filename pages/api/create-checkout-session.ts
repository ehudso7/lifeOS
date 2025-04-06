import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { plugin_id, price_cents, user_id } = JSON.parse(req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Plugin Access`,
          },
          unit_amount: price_cents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id,
      plugin_id,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/plugins/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/plugins`,
  });

  res.status(200).json({ url: session.url });
}

