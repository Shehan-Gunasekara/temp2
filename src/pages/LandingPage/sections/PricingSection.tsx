import React from "react";
import { PricingCard } from "../components/PricingCard";
import { Sparkles, Zap, Building } from "lucide-react";

interface Props {
  onGetStarted: () => void;
}

export function PricingSection({ onGetStarted }: Props) {
  return (
    <section className="py-24 bg-black/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-black/60">
            Start creating AI actors with our flexible pricing plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Starter"
            price={`${import.meta.env.VITE_CURRENCY}9.99`}
            description="Perfect for getting started with AI actors"
            features={[
              "10 generation credits included",
              "720p video quality",
              "Basic customization options",
              "Pay-per-use top-up available",
              "Community support",
            ]}
            buttonText="Start Creating"
            onClick={onGetStarted}
            icon={Sparkles}
          />

          <PricingCard
            title="Creator"
            price={`${import.meta.env.VITE_CURRENCY}29.99`}
            description="Ideal for content creators"
            features={[
              "50 generation credits included",
              "1080p video quality",
              "Advanced customization options",
              "Discounted top-up rates",
              "Priority support",
            ]}
            buttonText="Start Free Trial"
            onClick={onGetStarted}
            highlighted
            icon={Zap}
          />

          <PricingCard
            title="Enterprise"
            price="Custom"
            description="For teams and businesses"
            features={[
              "Unlimited generations",
              "4K video quality",
              "Full customization suite",
              "API access",
              "Dedicated support",
            ]}
            buttonText="Contact Sales"
            onClick={() => (window.location.href = "#contact")}
            icon={Building}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl bg-gradient-to-br from-white to-black/[0.02] border border-black/5">
            <p className="text-lg text-black/80">
              Need more credits? Top up anytime at competitive per-generation
              rates.
              <br />
              <span className="text-black/60">
                Unused credits never expire. Cancel your subscription anytime.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
