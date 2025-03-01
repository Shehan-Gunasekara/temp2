import { loadStripe } from "@stripe/stripe-js";

// Replace with your Stripe publishable key
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const STRIPE_PRICES = {
  starter: import.meta.env.VITE_STRIPE_STARTER_PRICE_ID,
  creator: import.meta.env.VITE_STRIPE_CREATOR_PRICE_ID,
  enterprise: import.meta.env.VITE_STRIPE_ENTERPRISE_ID,
} as const;
