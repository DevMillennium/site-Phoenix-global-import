import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/** Retorna o cliente Stripe. Só inicializa quando chamado (evita erro no build sem env). */
function getStripe(): Stripe | null {
  if (stripeInstance) return stripeInstance;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripeInstance = new Stripe(secret, { typescript: true });
  return stripeInstance;
}

export { getStripe };
