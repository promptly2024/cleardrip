"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { APIURL } from "@/utils/env"
import { Phone, Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner";

export default function ContactSection() {
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
        <section className="py-16 px-6 bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left side - Contact Form */}
                        <div className="lg:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold text-blue-600">Get in touch</h2>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                {error && <p className="text-red-600">{error}</p>}
                                {success && <p className="text-green-600">Thank you for contacting us! We will get back to you shortly.</p>}
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="border-gray-300 rounded-lg"
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    className="border-gray-300 rounded-lg"
                                />
                                <Textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    rows={4}
                                    className="border-gray-300 rounded-lg resize-none"
                                />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 hover:cursor-pointer"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>

                            <p className="text-sm text-gray-600 text-center">We respond within 24 hours</p>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-3" onClick={() => window.location.href = 'tel:+919810916388'}>
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">Call Us</div>
                                        <div className="text-gray-600 hover:cursor-pointer">+91 9810916388</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3" onClick={() => window.location.href = 'mailto:support@cleardrip.com'}>
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">E-mail</div>
                                        <div className="text-gray-600 hover:cursor-pointer">Support @cleardrip.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Map */}
                        <div className="lg:w-1/2">
                            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.918657204778!2d77.20902161461664!3d28.613939691769254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37e7f6aab9%3A0xa3b42c0b8c8f2c73!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1692288000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    // allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full object-cover"
                                ></iframe>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                                        <div className="font-bold text-gray-900">New Delhi</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 text-center mt-4">
                                Tap the map to get directions to our support center
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
