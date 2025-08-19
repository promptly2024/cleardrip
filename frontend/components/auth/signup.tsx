export default function SignUp() {
    return (
        <section className="relative bg-blue-600 py-20 px-4 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-20 w-16 h-0.5 bg-white/30 rotate-45"></div>
            <div className="absolute top-32 right-32 w-12 h-0.5 bg-white/30 -rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-0.5 bg-white/30 rotate-12"></div>
            <div className="absolute bottom-32 right-20 w-8 h-0.5 bg-white/30 -rotate-45"></div>

            {/* Curved decorative line */}
            <div className="absolute top-16 left-1/3">
                <svg width="60" height="40" viewBox="0 0 60 40" className="text-white/30">
                    <path d="M10 30 Q30 10 50 20" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto relative">
                {/* Main heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Log in or create your
                        <br />
                        cleardrip account now
                    </h2>
                </div>

                {/* Floating benefit cards */}
                <div className="relative">
                    {/* Affordable subscription plans - bottom left */}
                    <div className="absolute left-0 bottom-0 md:left-8 md:bottom-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs">
                            <h3 className="text-xl font-semibold text-gray-900 text-center">
                                Affordable
                                <br />
                                subscription
                                <br />
                                plans
                            </h3>
                        </div>
                    </div>

                    {/* Tailored services - top right */}
                    <div className="absolute right-0 top-0 md:right-8 md:top-0">
                        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm">
                            <h3 className="text-xl font-semibold text-gray-900 text-center">
                                Tailored services
                                <br />
                                available to keep
                                <br />
                                your ro in shape
                            </h3>
                        </div>
                    </div>

                    {/* Live TDS updates - bottom right */}
                    <div className="absolute right-0 bottom-0 md:right-16 md:bottom-16">
                        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xs">
                            <h3 className="text-xl font-semibold text-gray-900 text-center">
                                Live TDS
                                <br />
                                updates
                            </h3>
                        </div>
                    </div>

                    {/* Spacer for mobile layout */}
                    <div className="h-96 md:h-80"></div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg">
                        Create Account Now
                    </button>
                </div>
            </div>
        </section>
    )
}
