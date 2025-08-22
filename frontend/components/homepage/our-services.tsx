// import { Button } from "@/components/ui/button"

// const services = [
//     {
//         id: 1,
//         title: "AMC Cleaning",
//         description: "Scheduled deep cleaning & key replacements—zero hidden costs.",
//         image: "/beforeandafter.png",
//     },
//     {
//         id: 2,
//         title: "Filter change",
//         description: "Swap the filter. Keep the purity.",
//         image: "/filter-change.png",
//     },
//     {
//         id: 3,
//         title: "Urgent visit",
//         description: "Quick action for leaks, blockages, or breakdowns—perfect for urgent RO issues.",
//         image: "/serviceman.png",
//     },
// ]

// export default function OurServices() {
//     return (
//         <section className="py-16 px-4 bg-gray-50">
//             <div className="max-w-6xl mx-auto">
//                 <div className="text-center mb-12">
//                     <h2 className="text-4xl font-bold text-blue-600 mb-4">Our Services</h2>
//                     <p className="text-xl text-gray-600">What We Can Do for Your RO System</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//                     {services.map((service) => (
//                         <div key={service.id} className="bg-white rounded-3xl p-6 shadow-lg">
//                             {/* Service Image */}
//                             <div className="relative mb-6 bg-gray-100 rounded-2xl h-88 overflow-hidden">

//                                 <img
//                                     src={service.image || "/placeholder.png"}
//                                     alt={service.title}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>

//                             {/* Service Info */}
//                             <div>
//                                 <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
//                                 <p className="text-gray-600">{service.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* CTA Button */}
//                 <div className="text-center">
//                     <Button
//                         size="lg"
//                         className="rounded-full px-12 py-6 text-lg bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50"
//                         variant="outline"
//                     >
//                         Schedule now
//                     </Button>
//                 </div>
//             </div>
//         </section>
//     )
// }

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Shield, Zap } from "lucide-react"

interface Service {
    id: number;
    title: string;
    description: string;
    image: string;
    icon: React.ElementType;
    color: keyof typeof colorVariants;
    features: string[];
}

const services: Service[] = [
    {
        id: 1,
        title: "AMC Cleaning",
        description: "Scheduled deep cleaning & key replacements—zero hidden costs.",
        image: "/beforeandafter.png",
        icon: Shield,
        color: "blue",
        features: ["Deep cleaning", "Key replacements", "No hidden costs"]
    },
    {
        id: 2,
        title: "Filter Change",
        description: "Swap the filter. Keep the purity.",
        image: "/filter-change.png",
        icon: Clock,
        color: "green",
        features: ["Quick replacement", "Quality assured", "Extended life"]
    },
    {
        id: 3,
        title: "Urgent Visit",
        description: "Quick action for leaks, blockages, or breakdowns—perfect for urgent RO issues.",
        image: "/serviceman.png",
        icon: Zap,
        color: "orange",
        features: ["24/7 availability", "Emergency response", "Expert technicians"]
    },
]

const colorVariants = {
    blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "bg-blue-600",
        text: "text-blue-600",
        button: "hover:bg-blue-50 hover:border-blue-300"
    },
    green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "bg-green-600",
        text: "text-green-600",
        button: "hover:bg-green-50 hover:border-green-300"
    },
    orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "bg-orange-600",
        text: "text-orange-600",
        button: "hover:bg-orange-50 hover:border-orange-300"
    }
}

export default function OurServices() {
    return (
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Shield className="w-4 h-4" />
                        Professional Services
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 leading-tight">
                        Our Services
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Comprehensive care for your RO system with transparent pricing and expert service
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
                    {services.map((service: Service, index: number) => {
                        const IconComponent = service.icon
                        const colors = colorVariants[service.color]

                        return (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                IconComponent={IconComponent}
                                colors={colors}
                                index={index}
                            />
                        )
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200 max-w-2xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                            Ready to get started?
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg">
                            Schedule your service today and experience the Cleardrip difference
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                Schedule Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-300"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// Extracted ServiceCard component for better organization and reusability
function ServiceCard({ service, IconComponent, colors, index }: { service: Service, IconComponent: React.ElementType, colors: any, index: number }) {
    return (
        <div
            className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border-2 ${colors.border} hover:scale-105`}
            style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            {/* Service Image */}
            <div className={`relative h-48 sm:h-52 lg:h-56 ${colors.bg} overflow-hidden`}>
                <img
                    src={service.image || "/placeholder.png"}
                    alt={`${service.title} service illustration`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating icon */}
                <div className={`absolute top-4 right-4 w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Service Content */}
            <div className="p-6 lg:p-8">
                <h3 className={`text-xl lg:text-2xl font-bold mb-3 ${colors.text} group-hover:text-gray-800 transition-colors duration-300`}>
                    {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-base lg:text-lg">
                    {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-6">
                    {service.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                            <div className={`w-1.5 h-1.5 ${colors.icon} rounded-full`}></div>
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Service CTA */}
                <Button
                    variant="outline"
                    size="sm"
                    className={`w-full rounded-full border-2 font-medium transition-all duration-300 ${colors.button}`}
                >
                    Book Service
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
            </div>
        </div>
    )
}

// Add CSS for fade-in animation
const styles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
}