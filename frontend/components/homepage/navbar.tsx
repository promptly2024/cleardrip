import React from 'react'
import { Button } from '@/components/ui/button'
import { Grid3X3, Search, ShoppingCart } from 'lucide-react'
import Image from 'next/image'


const Navbar = () => {
    return (
        <div>
            <nav className="flex items-center justify-between px-6 py-4 bg-white">
                <div className="flex items-center gap-2">
                    {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded"></div> */}
                    {/* <Image src="/cleardrip-logo.png" alt="Clear Drip Logo"  /> */}
                    <img src="/cleardrip-logo.png" alt="Clear Drip Logo" className="w-8 h-8" />
                    <span className="font-bold text-xl text-gray-900">CLEARDRIP</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-gray-900 hover:text-blue-600 font-medium">
                        Home
                    </a>
                    <a href="#" className="text-gray-900 hover:text-blue-600 font-medium">
                        Products
                    </a>
                    <a href="#" className="text-gray-900 hover:text-blue-600 font-medium">
                        Services
                    </a>
                    <a href="#" className="text-gray-900 hover:text-blue-600 font-medium">
                        Pricing
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="bg-transparent border-none outline-none text-sm"
                        />
                    </div>
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <Grid3X3 className="w-5 h-5 text-gray-600" />
                    <Button variant="outline" className="rounded-lg bg-transparent">
                        Sign up
                    </Button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
