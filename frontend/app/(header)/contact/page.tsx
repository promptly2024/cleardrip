"use client"
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail } from "lucide-react"
import { toast } from "sonner"
import { APIURL } from "@/utils/env"
import Footer from "@/components/layout/Footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address.")
      return
    }
    try {
      setError(null)
      setIsSubmitting(true)
      setSuccess(false)
      const response = await fetch(`${APIURL}/contactus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        toast.success("Form submitted successfully", { description: "We will get back to you shortly." })
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || errorData.message || "An error occurred while submitting the form."
        toast.error('Some error occurred',
          {
            description: errorMessage,
            action: {
              label: 'Retry',
              onClick: handleSubmit
            }
          })
      }
    } catch (error) {
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Contact Form */}
            <div className="p-8 lg:p-12">
              <h1 className="text-3xl font-bold text-blue-600 mb-8">Get in touch</h1>

              {error && (
                <div className="mb-4">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-4">
                  <p className="text-green-500">Form submitted successfully!</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  disabled={!formData.name || !formData.email || !formData.message || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-center text-gray-500 text-sm">We respond within 24 hours</p>
              </form>
            </div>

            {/* Right Side - Customer Service Image + Contact Info */}
            <div className="relative bg-gray-100 lg:bg-transparent flex flex-col items-center justify-center py-12">
              <img
                src="/customerservicerepresentative.jpg"
                alt="Customer Service Representative"
                className="w-64 h-64 object-cover rounded-xl mb-6"
              />
              <div className="space-y-6 w-full max-w-xs">
                <div className="flex items-center space-x-4 hover:cursor-pointer"
                  onClick={() => window.location.href = "tel +919810916388"}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">Call Us</h3>
                    <p className="text-gray-600 text-sm">91+ 9810916388</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => window.location.href = "mailto:cleardrip.solutions@gmail.com"}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">E-mail</h3>
                    <p className="text-gray-600 text-sm">cleardrip.solutions@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96 bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.918657204778!2d77.20902161461664!3d28.613939691769254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37e7f6aab9%3A0xa3b42c0b8c8f2c73!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1692288000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              // allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            ></iframe>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900">New Delhi</h3>
              </div>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">Tap the map to get directions to our support center</p>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}