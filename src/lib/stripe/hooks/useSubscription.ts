import { useState } from "react";
import { stripePromise, STRIPE_PRICES } from "../config";
import type { PricingTier } from "../../../types/subscription";
// import { useAuth } from "../../../features/auth/hooks/useAuth";

import { auth } from "../../firebase";
import { getIdToken } from "firebase/auth";
import { useAuth } from "../../../features/auth/context/useAuth";
import { useLanguage } from "../../../features/auth/context/LanguageContext";
import { getTranslation } from "../../../utils/translations";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { language } = useLanguage();
  const subscribe = async (
    tier: PricingTier | "custom",
    customAmount?: string | number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const token = auth.currentUser
        ? await getIdToken(auth.currentUser)
        : null;

      if (!token) {
        setError(getTranslation(language, "ugc_error.user_credential"));
        return;
      }

      // Handle custom amount validation
      const parsedAmount =
        tier === "custom" && customAmount
          ? parseFloat(customAmount.toString())
          : undefined;

      const body = {
        user: user?.email,
        customAmount: parsedAmount,
        priceId: tier !== "custom" ? STRIPE_PRICES[tier] : undefined,
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_END_POINT_URL
        }/api/payment/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create checkout session");
      }
      setLoading(false);
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribe,
    loading,
    error,
  };
}
