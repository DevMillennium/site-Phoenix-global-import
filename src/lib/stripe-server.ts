import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  throw new Error("STRIPE_SECRET_KEY não está definida. Configure em .env.local");
}

export const stripe = new Stripe(secret, {
  typescript: true,
});
