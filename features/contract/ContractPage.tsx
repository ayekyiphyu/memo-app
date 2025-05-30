import React, { useState } from "react";
import LeafletMap from "@/components/map/Map";
import ContactForm from "@/components/form/contactForm";

export default function ContactPage() {
    return (
        <div className="w-full bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">
                Contact Us
            </h1>
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-[2rem]">
                {/* Contact Form Card */}
                <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                        Get in Touch
                    </h2>
                    <ContactForm />
                </div>

                {/* Map Card */}
                <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
                    <LeafletMap />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}