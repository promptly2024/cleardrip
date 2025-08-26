"use client";
import { useRouter } from 'next/navigation'
import React from 'react'

const NotFound = () => {
    const router = useRouter();
    const handleGoBack = () => {
        router.back();
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Not Found</h1>
                <p className="text-gray-700 mb-6">The page you are looking for does not exist.</p>
                <button
                    onClick={handleGoBack}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
}

export default NotFound
