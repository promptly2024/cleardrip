import { Settings, Wrench, BarChart3 } from "lucide-react"

export default function HowCleardripWorks() {
    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">How Cleardrip Works</h2>
                    <p className="text-xl text-gray-600">A three step flow</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="w-80 h-80 rounded-full  p-8 flex items-center justify-center">
                                <img
                                    src="/watertap.png"
                                    alt="Cleardrip RO System"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Steps Flow */}
                    <div className="flex flex-col gap-6 lg:ml-8">
                        {/* Step 1: Install */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-sm">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Settings className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Install</h3>
                                </div>
                                <p className="text-gray-600">Choose a Cleardrip RO machine with built-in smart monitoring.</p>
                            </div>
                            
                        </div>

                        {/* Step 2: Auto-service */}
                        <div className="relative lg:ml-16">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-sm">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Wrench className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Auto - service</h3>
                                </div>
                                <p className="text-gray-600">Get notified & schedule service before breakdowns happen.</p>
                            </div>
                            
                        </div>

                        {/* Step 3: Monitor */}
                        <div className="lg:ml-32">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-sm">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Monitor</h3>
                                </div>
                                <p className="text-gray-600">View water quality & filter health on your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
