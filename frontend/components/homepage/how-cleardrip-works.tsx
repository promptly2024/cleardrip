import { Settings, Wrench, BarChart3 } from "lucide-react"

interface Steps {
    icon: React.ElementType;
    title: string;
    description: string;
    bgColor: string;
    stepNumber: string;
}
export default function HowCleardripWorks() {
    const steps: Steps[] = [
        {
            icon: Settings,
            title: "Install",
            description: "Choose a Cleardrip RO machine with built-in smart monitoring.",
            bgColor: "bg-blue-600",
            stepNumber: "01"
        },
        {
            icon: Wrench,
            title: "Auto-service",
            description: "Get notified & schedule service before breakdowns happen.",
            bgColor: "bg-blue-600",
            stepNumber: "02"
        },
        {
            icon: BarChart3,
            title: "Monitor",
            description: "View water quality & filter health on your dashboard.",
            bgColor: "bg-blue-600",
            stepNumber: "03"
        }
    ]

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 leading-tight">
                        How Cleardrip Works
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        A simple three-step flow to pure, monitored water
                    </p>
                </div>

                {/* Main Content */}
                <div className="flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-12">
                    {/* Product Image Section */}
                    <div className="flex-shrink-0 order-2 xl:order-1">
                        <div className="relative group">
                            <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="/watertap.png"
                                    alt="Cleardrip RO System - Smart water purification technology"
                                    className="w-full h-full object-contain drop-shadow-lg"
                                    loading="lazy"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
                            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
                        </div>
                    </div>

                    {/* Steps Flow Section */}
                    <div className="flex-1 order-1 xl:order-2 w-full max-w-2xl">
                        {/* Mobile: Horizontal scroll on small screens */}
                        <div className="block sm:hidden">
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                                {steps.map((step, index) => {
                                    const IconComponent = step.icon
                                    return (
                                        <div key={index} className="flex-shrink-0 snap-center">
                                            <StepCard
                                                step={step}
                                                IconComponent={IconComponent}
                                                index={index}
                                                isLast={index === steps.length - 1}
                                                isMobile={true}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Tablet and Desktop: Staggered layout */}
                        <div className="hidden sm:flex flex-col gap-6 lg:gap-8">
                            {steps.map((step, index) => {
                                const IconComponent = step.icon
                                const offsetClass = index === 1 ? 'sm:ml-12 lg:ml-20' : index === 2 ? 'sm:ml-24 lg:ml-40' : ''

                                return (
                                    <div key={index} className={`relative ${offsetClass}`}>
                                        <StepCard
                                            step={step}
                                            IconComponent={IconComponent}
                                            index={index}
                                            isLast={index === steps.length - 1}
                                            isMobile={false}
                                        />
                                        {/* Connection Line */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden sm:block absolute top-full left-6 w-0.5 h-6 lg:h-8 bg-gradient-to-b from-blue-300 to-transparent"></div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function StepCard({ step, IconComponent, index, isLast, isMobile }: { step: Steps, IconComponent: React.ElementType, index: number, isLast: boolean, isMobile: boolean }) {
    return (
        <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group ${isMobile ? 'w-72' : 'max-w-sm w-full'}`}>
            {/* Step Number Badge */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {step.stepNumber}
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${step.bgColor} rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
                {step.description}
            </p>
        </div>
    )
}