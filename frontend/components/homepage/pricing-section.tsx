import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star, Sparkles, Crown, Shield } from "lucide-react"

interface Plans {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    popular: boolean;
    icon: React.ElementType;
    features: string[];
    savings: string | null;
    buttonText: string;
    buttonVariant: "outline" | "default";
}

const plans: Plans[] = [
    {
        id: "basic",
        name: "Basic",
        price: "600",
        period: "1 Year",
        description: "Perfect for regular maintenance",
        popular: false,
        icon: Shield,
        features: [
            "Monthly RO cleaning",
            "Real-time TDS monitoring",
            "Service reminders & support",
            "Scheduled filter replacements",
            "Basic customer support"
        ],
        savings: null,
        buttonText: "Get Started",
        buttonVariant: "outline"
    },
    {
        id: "premium",
        name: "Premium",
        price: "2,500",
        period: "Lifetime",
        description: "Best value for long-term peace of mind",
        popular: true,
        icon: Crown,
        features: [
            "Unlimited RO cleaning & filter replacements",
            "Priority support access",
            "Lifetime TDS monitoring",
            "Emergency service calls",
            "Annual system health checkups",
            "Big long-term savings"
        ],
        savings: "Save 70%",
        buttonText: "Best Value",
        buttonVariant: "default"
    }
]

export default function PricingSection() {
    return (
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-br from-white via-blue-50/20 to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Simple Pricing
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-6 leading-tight">
                        Choose your plan.
                        <br className="hidden sm:block" />
                        <span className="text-gray-700">We'll handle the rest</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Transparent pricing with no hidden fees. Choose the plan that fits your needs.
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-stretch">
                    {/* Promotional Card */}
                    <div className="xl:w-1/3 order-3 xl:order-1">
                        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 lg:p-10 text-white h-full relative overflow-hidden">
                            {/* Background decorative elements */}
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

                    {/* Pricing Plans */}
                    <div className="xl:w-7/12 order-1 xl:order-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {plans.map((plan, index) => {
                                const IconComponent = plan.icon

                                return (
                                    <PricingCard
                                        key={plan.id}
                                        plan={plan}
                                        IconComponent={IconComponent}
                                        index={index}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 lg:mt-20 text-center">
                    <div className="bg-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6 text-lg">
                            Our team is here to help you choose the right plan for your needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
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
    )
}

// Extracted PricingCard component
function PricingCard({ plan, IconComponent, index }: { plan: Plans; IconComponent: React.ElementType; index: number }) {
    return (
        <div
            className={`relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 group ${plan.popular
                ? 'border-blue-500 ring-4 ring-blue-100 scale-105 lg:scale-110'
                : 'border-gray-200 hover:border-blue-300'
                }`}
            style={{
                animationDelay: `${index * 200}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
            }}
        >
            {/* Popular Badge */}
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
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
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${plan.popular ? 'bg-blue-600' : 'bg-gray-600'
                    } shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                </h3>
                <p className="text-gray-600 text-base lg:text-lg">
                    {plan.description}
                </p>
            </div>

            {/* Price Display */}
            <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-3xl lg:text-4xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500 text-lg">/ {plan.period}</span>
                </div>
                {plan.period === "Lifetime" && (
                    <p className="text-sm text-green-600 font-medium">One-time payment</p>
                )}
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                            <Check className={`w-3 h-3 ${plan.popular ? 'text-blue-600' : 'text-gray-600'
                                }`} />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <Button
                className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 group ${plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                    }`}
                variant={plan.buttonVariant}
            >
                {plan.buttonText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            {/* Value Proposition */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    {plan.period === "Lifetime" ? "Never worry about RO maintenance again" : "Cancel anytime, no questions asked"}
                </p>
            </div>
        </div>
    )
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

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}
`

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
}