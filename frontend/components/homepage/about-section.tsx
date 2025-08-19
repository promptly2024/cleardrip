export default function AboutSection() {
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left side - Image and Stats */}
                    <div className="lg:w-1/2">
                        <div className="relative">
                            <img
                                src="/teamofbuisness.avif"
                                alt="Cleardrip team of professionals"
                                className="rounded-lg w-full h-80 object-cover"
                            />

                            {/* Stats overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">15 +</div>
                                        <div className="text-sm text-gray-600">Years of experience</div>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">50,000 +</div>
                                        <div className="text-sm text-gray-600">RO Units maintained</div>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">1M +</div>
                                        <div className="text-sm text-gray-600">Service records</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="lg:w-1/2 space-y-6">
                        <div className="text-sm text-gray-600 uppercase tracking-wide">About us</div>

                        <h2 className="text-4xl font-bold text-gray-900">
                            <span className="text-blue-600">Cleardrip</span> brings smart, safe water to your home, powered by
                            real-time monitoring and predictive tech.
                        </h2>

                        <div className="border-l-4 border-blue-600 pl-6 space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">By Instant TDS Alerts</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Our system tracks Total Dissolved Solids in real time. If levels spike beyond safe limits, you'll be
                                notified immediately—so your family is always protected.
                            </p>
                        </div>

                        <div className="pt-4">
                            <p className="text-gray-700">
                                Ready for smart water care?{" "}
                                <a href="#" className="text-blue-600 underline">
                                    Explore our RO systems
                                </a>{" "}
                                your home deserve this
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
