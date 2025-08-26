"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, Crown, Shield, Sparkles } from "lucide-react";
import { SubscriptionClass } from "@/lib/httpClient/subscription";
import { SubscriptionPlan } from "@/lib/types/subscription";

// Icon assignment logic based on plan name
const iconMap: Record<string, React.ElementType> = {
  Basic: Shield,
  Premium: Crown,
  Standard: Star,
};


export default function SubscriptionsSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const response = await SubscriptionClass.getAllSubscriptions();
        if (response && response.success && response.data) {
          setPlans(
            response.data.map((plan: any) => ({
              id: plan.id,
              name: plan.name,
              price: plan.price,
              duration: plan.duration,
              description: plan.description,
              features: plan.features,
              savings: plan.savings ?? null,
              popular: plan.popular ?? false,
            }))
          );
        } else {
          setError("Failed to load subscriptions.");
        }
      } catch (err) {
        setError("Unexpected error occurred while fetching subscriptions.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    try {
      await SubscriptionClass.subscribeToPlan(planId);
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4" style={{ background: 'linear-gradient(to bottom right, var(--white-50), var(--blue-50), var(--white-100))' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--blue-100)', color: 'var(--blue-800)' }}>
            <Sparkles className="w-4 h-4" />
            Available Subscriptions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--blue-500)' }}>
            Choose your plan.
            <br className="hidden sm:block" />
            <span style={{ color: 'var(--blue-900)' }}>We'll handle the rest</span>
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--blue-800)' }}>
            Transparent pricing with no hidden fees. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Promotional Card */}
          <div className="xl:w-1/3 order-3 xl:order-1">
            <div className="rounded-3xl p-8 lg:p-10 text-white h-full relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--blue-600), var(--blue-700), var(--blue-800))' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <span className="text-yellow-300 font-semibold">Special Offer</span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                  Save more with annual plans — exclusive loyalty discount included.
                </h3>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>

                <div className="mt-8">
                  <img
                    src="/manspeaking.png"
                    alt="Happy customer testimonial illustration"
                    className="w-full h-48 lg:h-56 object-contain opacity-90"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="xl:w-7/12 order-1 xl:order-2">
            {loading ? (
              <div className="text-center py-20 text-xl" style={{ color: 'var(--blue-600)' }}>Loading subscriptions…</div>
            ) : error ? (
              <div className="text-center py-20 text-xl text-red-600">{error}</div>
            ) : plans.length === 0 ? (
              <div className="text-center py-20 text-xl" style={{ color: 'var(--blue-800)' }}>No subscriptions found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {plans.map((plan, index) => {
                  const IconComponent = iconMap[plan.name] || Shield;
                  return (
                    <PricingCard
                      key={plan.id}
                      plan={plan}
                      IconComponent={IconComponent}
                      index={index}
                      onSubscribe={() => handleSubscribe(plan.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-20 text-center">
          <div className="rounded-2xl p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--white-200)' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--blue-900)' }}>
              Still have questions?
            </h3>
            <p className="mb-6 text-lg" style={{ color: 'var(--blue-800)' }}>
              Our team is here to help you choose the right plan for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-2"
                style={{ borderColor: 'var(--blue-600)', color: 'var(--blue-600)' }}
              >
                Contact Sales
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg"
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Card Component
function PricingCard({ 
  plan, 
  IconComponent, 
  index, 
  onSubscribe 
}: { 
  plan: SubscriptionPlan; 
  IconComponent: React.ElementType; 
  index: number; 
  onSubscribe: () => void;
}) {
  return (
    <div
      className={`relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 group ${
        plan.popular
          ? 'ring-4 scale-105 lg:scale-110'
          : 'hover:border-blue-300'
      }`}
      style={{
        borderColor: plan.popular ? 'var(--blue-500)' : 'var(--white-400)',
        animationDelay: `${index * 200}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2" style={{ background: 'linear-gradient(to right, var(--blue-600), var(--blue-700))' }}>
            <Star className="w-4 h-4 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      {/* Savings Badge */}
      {plan.savings && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
          {plan.savings}
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: plan.popular ? 'var(--blue-600)' : 'var(--blue-800)' }}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: 'var(--blue-900)' }}>
          {plan.name}
        </h3>
        <p className="text-base lg:text-lg" style={{ color: 'var(--blue-800)' }}>
          {plan.description}
        </p>
      </div>

      {/* Price Display */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-3xl lg:text-4xl font-bold" style={{ color: 'var(--blue-900)' }}>₹{plan.price}</span>
          <span className="text-lg" style={{ color: 'var(--blue-700)' }}>/ {plan.duration} days</span>
        </div>
        {plan.duration === "Lifetime" && (
          <p className="text-sm text-green-600 font-medium">One-time payment</p>
        )}
      </div>

      {/* Features List */}
      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: plan.popular ? 'var(--blue-100)' : 'var(--white-200)' }}>
                <Check className="w-3 h-3" style={{ color: plan.popular ? 'var(--blue-600)' : 'var(--blue-800)' }} />
              </div>
              <span className="leading-relaxed" style={{ color: 'var(--blue-900)' }}>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <Button
        onClick={onSubscribe}
        className="w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 group text-white shadow-lg hover:shadow-xl"
        style={{ backgroundColor: plan.popular ? 'var(--blue-600)' : 'var(--blue-800)' }}
      >
        Subscribe
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>

      {/* Value Proposition */}
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--blue-700)' }}>
          {plan.duration === "Lifetime" ? "Never worry about RO maintenance again" : "Cancel anytime, no questions asked"}
        </p>
      </div>
    </div>
  );
}

// Add CSS for animations
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
