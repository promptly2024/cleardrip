import { Button } from "@/components/ui/button"

const services = [
    {
        id: 1,
        title: "AMC Cleaning",
        description: "Scheduled deep cleaning & key replacements—zero hidden costs.",
        image: "/beforeandafter.png",
    },
    {
        id: 2,
        title: "Filter change",
        description: "Swap the filter. Keep the purity.",
        image: "/filter-change.png",
    },
    {
        id: 3,
        title: "Urgent visit",
        description: "Quick action for leaks, blockages, or breakdowns—perfect for urgent RO issues.",
        image: "/serviceman.png",
    },
]

export default function OurServices() {
    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">Our Services</h2>
                    <p className="text-xl text-gray-600">What We Can Do for Your RO System</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-3xl p-6 shadow-lg">
                            {/* Service Image */}
                            <div className="relative mb-6 bg-gray-100 rounded-2xl h-88 overflow-hidden">
                                
                                <img
                                    src={service.image || "/placeholder.png"}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Service Info */}
                            <div>
                                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        className="rounded-full px-12 py-6 text-lg bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50"
                        variant="outline"
                    >
                        Schedule now
                    </Button>
                </div>
            </div>
        </section>
    )
}
