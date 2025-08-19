"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
    {
        question: "What does the Cleardrip warranty cover ?",
        answer:
            "Our comprehensive warranty covers all major components including the RO membrane, filters, pump, and electronic monitoring system for up to 2 years from installation date.",
    },
    {
        question: "How do I claim warranty service?",
        answer:
            "You can claim warranty service through our mobile app, website, or by calling our customer service. Our team will verify your warranty status and schedule a visit within 24 hours.",
    },
    {
        question: "How often should I clean my ro system ?",
        answer:
            "To keep things running at their best, we recommend a full cleaning every 6 months. Cleardrip's AMC plans handle this with scheduled maintenance.",
        isOpen: true,
    },
    {
        question: "How do real - time alerts work ?",
        answer:
            "Our smart monitoring system continuously tracks water quality parameters. When TDS levels exceed safe limits, you receive instant notifications via SMS, app notifications, and email alerts.",
    },
]

export default function FAQSection() {
    const [openItems, setOpenItems] = useState<number[]>([])

    const toggleItem = (index: number) => {
        setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    }

    return (
        <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-12">FAQ & Resources</h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                                {openItems.includes(index) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {openItems.includes(index) && (
                                <div className="px-6 pb-4 bg-blue-50">
                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
