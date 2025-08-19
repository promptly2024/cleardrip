import { Button } from "@/components/ui/button"
import Navbar from "./navbar"
import { X } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
    const [showTdsAlert, setShowTdsAlert] = useState(true);

    const handleCloseAlert = () => {
        setShowTdsAlert(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
            {/* Navigation */}
            <Navbar />

            {/* Alert Banner */}
            {showTdsAlert && (
                <div className="bg-orange-100 border-l-4 border-orange-400 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">!</span>
                        </div>
                        <span className="text-gray-800">
                            High TDS levels detected.{" "}
                            <a href="#" className="text-blue-600 underline">
                                Service recommended....
                            </a>
                        </span>
                    </div>
                    <X className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleCloseAlert} />
                </div>
            )}

            {/* Hero Content */}
            <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-16 max-w-7xl mx-auto">
                <div className="lg:w-1/2 text-white space-y-6">
                    <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                        Smart Water Care
                        <br />
                        That Just Works
                    </h1>
                    <p className="text-xl text-blue-100 max-w-md">Cleardrip alerts you instantly when TDS crosses safe limits.</p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg px-8 py-3">
                        Book a service
                    </Button>
                </div>

                <div className="lg:w-1/2 mt-8 lg:mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <img
                                src="/hero1.png"
                                alt="Technician servicing RO system"
                                className="rounded-lg w-full h-48 object-cover"
                            />
                            <img
                                src="/hero2.png"
                                alt="Water filtration components"
                                className="rounded-lg w-full h-48 object-cover"
                            />
                        </div>
                        <div className="space-y-4 mt-8">
                            <img
                                src="/hero3.png"
                                alt="TDS monitoring device"
                                className="rounded-lg w-full h-36 object-cover"
                            />
                            <img
                                src="/hero4.png"
                                alt="RO system installation"
                                className="rounded-lg w-full h-60 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
