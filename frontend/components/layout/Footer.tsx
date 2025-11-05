import { Droplets, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return <footer id="contact" className="bg-gray-900 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <img src="/cleardrip-logo.png" alt="cleardriplogo"
            className="cursor-pointer mb-6"
            height={70}
            width={70}
          />
          <p className="text-gray-400 mb-6">
            Your trusted partner for smart water health monitoring and RO services.
          </p>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              <span className="text-sm font-semibold">f</span>
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              <span className="text-sm font-semibold">t</span>
            </div>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
              <span className="text-sm font-semibold">in</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2">
            <li><Link href="/services?type=maintenance" className="text-gray-400 hover:text-white transition-colors">RO Maintenance</Link></li>
            <li><Link href="/services?type=amc" className="text-gray-400 hover:text-white transition-colors">AMC Plans</Link></li>
            <li><Link href="/services?type=emergency" className="text-gray-400 hover:text-white transition-colors">Emergency Repairs</Link></li>
            <li><Link href="/services?type=testing" className="text-gray-400 hover:text-white transition-colors">Water Testing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 hover:cursor-pointer"
              onClick={() => window.location.href = 'tel: +919876543210'}
            >
              <Phone className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400">+91 9876543210</span>
            </div>
            <div className="flex items-center space-x-3 hover:cursor-pointer"
              onClick={() => window.location.href = 'mailto:cleardrip.solutions@gmail.com'}
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400">cleardrip.solutions@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400">Mumbai, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <p className="text-gray-400">© 2025 ClearDrip. All rights reserved.</p>
      </div>
    </div >
  </footer >
}