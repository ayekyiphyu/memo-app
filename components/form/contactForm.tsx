'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContactStore } from "@/store/useContactFormStore";


export default function ContactForm() {
    const { name, email, message, setField, resetForm } = useContactStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { name, email, message };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to send");

            alert("Message sent successfully!");
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Error sending message.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">Contact Us</h2>

            <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setField("name", e.target.value)}
                required
            />

            <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setField("email", e.target.value)}
                required
            />

            <Textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setField("message", e.target.value)}
                rows={5}
                required
            />

            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>
    );
}
