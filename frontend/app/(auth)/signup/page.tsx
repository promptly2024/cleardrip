"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SignupPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                <div className="flex flex-col justify-center items-center w-full p-12 relative">
                    <h1 className="text-4xl font-bold text-white mb-8 text-center leading-tight">
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

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                                <span className="text-xl font-bold text-blue-600">CLEARDRIP</span>
                            </div>
                            <h2 className="text-2xl font-bold text-blue-600 mb-2">Sign up</h2>
                        </div>

                        {/* Signup Form */}
                        <SignupFormFields />

                        {/* Login link */}
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 font-medium hover:underline">
                                Log in here
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

function SignupFormFields() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate signup
        setTimeout(() => setIsLoading(false), 2000)
    }

    const handleGoogleSignup = () => {
        // Handle Google signup
        console.log("Google signup clicked")
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
                    placeholder="Create password"
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

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                {isLoading ? "Creating account..." : "Continue"}
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                className="w-full h-12 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-3 bg-transparent"
            >
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </Button>
        </form>
    )
}
