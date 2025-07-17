import Header from "@/components/layout/Header";
import { Droplets, Shield, Smartphone, Users } from "lucide-react";

export default function About(){
    
    const features = [
    {
        icon: <Droplets className="w-8 h-8 text-blue-500" />,
        title: "Real-time TDS Monitoring",
        description: "Track water quality 24/7 with instant alerts when TDS levels go beyond safe limits"
        },
        {
        icon: <Smartphone className="w-8 h-8 text-green-500" />,
        title: "WhatsApp Bot Service",
        description: "Book RO services, renew subscriptions, and get support through our smart WhatsApp bot"
        },
        {
        icon: <Shield className="w-8 h-8 text-purple-500" />,
        title: "Smart Alerts & Reminders",
        description: "Never miss maintenance schedules with automated notifications and service reminders"
        },
        {
        icon: <Users className="w-8 h-8 text-orange-500" />,
        title: "Loyalty Rewards Program",
        description: "Earn points with every service and unlock exclusive discounts on future bookings"
        }
    ];


    return <div>
        <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Watercare?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of water health monitoring with our comprehensive platform designed to keep your family safe and your water pure.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="mb-6">
                    {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                </div>
                ))}
            </div>
            </div>
      </section>
    </div>
}