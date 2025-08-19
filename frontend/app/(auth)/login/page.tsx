"use client"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-scroll">
                <div className="flex flex-col justify-center items-center w-full p-12 relative">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center leading-tight">
                        Log in or create your
                        <br />
                        cleardrip account now
                    </h1>

                    {/* Floating Benefit Cards */}
                    <div className="relative w-full max-w-md">
                        {/* Tailored Services Card */}
                        <div className="absolute top-0 right-0 bg-white rounded-2xl p-6 shadow-lg max-w-xs transform rotate-2">
                            <p className="text-gray-800 font-medium text-center">
                                Tailored services available to keep your ro in shape
                            </p>
                        </div>

                        {/* Affordable Plans Card */}
                        <div className="absolute top-32 left-0 bg-white rounded-2xl p-6 shadow-lg max-w-xs transform -rotate-3">
                            <p className="text-gray-800 font-medium text-center">Affordable subscription plans</p>
                        </div>

                        {/* Live TDS Updates Card */}
                        <div className="absolute top-64 right-8 bg-white rounded-2xl p-6 shadow-lg max-w-xs transform rotate-1">
                            <p className="text-gray-800 font-medium text-center">Live TDS updates</p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20">
                        <svg width="60" height="40" viewBox="0 0 60 40" className="text-white/30">
                            <path d="M10 20 Q30 5 50 20" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    <div className="absolute bottom-32 right-20">
                        <svg width="40" height="60" viewBox="0 0 40 60" className="text-white/30">
                            <path d="M20 10 L35 25 L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br flex items-center justify-center">
                                    <img src="/cleardrip-logo.png" alt="Clear Drip Logo" className="w-4 h-4" />
                                </div>
                                <span className="text-xl font-bold text-blue-600">CLEARDRIP</span>
                            </div>
                            <h2 className="text-2xl font-bold text-blue-600 mb-2">Log in</h2>
                        </div>

                        {/* Login Form */}
                        <LoginFormFields />

                        {/* Sign up link */}
                        <p className="text-center text-gray-600 text-sm mt-6">
                            New to cleardrip?{" "}
                            <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                                Sign up here
                            </Link>
                        </p>

                        {/* Terms */}
                        <p className="text-center text-xs text-gray-500 mt-6">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-blue-600 hover:underline">
                                Terms of service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                                privacy policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoginFormFields() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate login
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
            </div>

            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="text-left">
                <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-blue-600">
                    Forget password ?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                {isLoading ? "Signing in..." : "Continue"}
            </Button>
        </form>
    )
}
