'use client';

import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Shield, 
  Smartphone, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Play,
  Zap,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Watercare
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
              <Link href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</Link>
              <Link href="#products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Products</Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>
            </nav>
            <div className="flex space-x-4">
              <Link href="/user/signin" className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Login
              </Link>
              <Link href="/user/signup" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible.home ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span>Smart Water Health Monitoring</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Pure Water,
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {' '}Smart Care
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Monitor your water quality in real-time, book RO services seamlessly, and ensure your family&apos;s health with our intelligent water management platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg">
                  Start Monitoring Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            <div className={`relative ${isVisible.home ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Water Quality Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">TDS Level</p>
                      <p className="text-2xl font-bold text-blue-700">145 ppm</p>
                      <p className="text-xs text-green-600">✓ Safe</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Filter Status</p>
                      <p className="text-2xl font-bold text-purple-700">78%</p>
                      <p className="text-xs text-orange-600">Replace Soon</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg">
                    <p className="text-sm opacity-90">Next Service</p>
                    <p className="font-semibold">July 25, 2025</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 transform scale-105"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive water care solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">RO Maintenance</h3>
              <p className="text-gray-600 mb-6">Regular maintenance and filter replacement services to keep your RO system running optimally.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Filter replacement
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  System cleaning
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Performance optimization
                </li>
              </ul>
              <Link href="/book-service" className="block w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center">
                Book Service
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AMC Plans</h3>
              <p className="text-gray-600 mb-6">Annual maintenance contracts with priority support and discounted services.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Priority booking
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Discounted rates
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Emergency support
                </li>
              </ul>
              <Link href="/subscriptions" className="block w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors text-center">
                View Plans
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Urgent Repairs</h3>
              <p className="text-gray-600 mb-6">24/7 emergency repair services for critical water system issues.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  24/7 availability
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Quick response
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Expert technicians
                </li>
              </ul>
              <Link href="/urgent-help" className="block w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors text-center">
                Get Help Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
