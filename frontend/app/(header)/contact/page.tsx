"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Have questions, feedback, or need support with Watercare services? Fill out the form below and our team will get back to you shortly.
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
            </div>

            <Input placeholder="Subject" required />

            <Textarea placeholder="Your Message" rows={5} required />

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Send Message
            </Button>
          </form>

          <div className="mt-10 border-t pt-6 text-sm text-gray-700 space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>support@watercare.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Watercare HQ, Bengaluru, India</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>Available on WhatsApp: +91 98765 43210</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
