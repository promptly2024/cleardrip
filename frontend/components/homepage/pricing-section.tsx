import { Button } from "@/components/ui/button"

export default function PricingSection() {
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">
                        Choose your plan.
                        <br />
                        We'll handle the rest
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Promotional Card */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Save more with annual plans — exclusive loyalty discount included.
                        </h3>
                        <div className="mt-8">
                            <img
                                src="/manspeaking.png"
                                alt="Happy customer illustration"
                                className="w-full h-48 object-contain"
                            />
                        </div>
                    </div>

                    {/* Basic Plan */}
                    <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                <div className="text-lg font-bold">₹ 600</div>
                                <div className="text-sm">1 Year</div>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Monthly RO cleaning</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Real - time TDS monitoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Service reminders & support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Scheduled filter replacements</span>
                            </li>
                        </ul>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3">Pay now</Button>
                    </div>

                    {/* Premium Plan */}
                    <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                <div className="text-lg font-bold">₹ 2,500</div>
                                <div className="text-sm">Lifetime</div>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Unlimited RO cleaning & filter replacements</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Priority support Access</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Lifetime TDS monitoring</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                <span className="text-gray-700">Big long - term savings</span>
                            </li>
                        </ul>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3">Pay now</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
