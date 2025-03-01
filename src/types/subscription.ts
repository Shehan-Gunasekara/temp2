export type PricingTier = 'starter' | 'creator' | 'enterprise' | 'custom';

export interface SubscriptionPlan {
  id: PricingTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  isCustom?: boolean;
}