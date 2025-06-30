// components/Chatbot.tsx

import React, { useState } from 'react';

// Define the structure of a message object with TypeScript
interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const [input, setInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return; // Don't send empty messages

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]); // Add user's message to the chat
        setInput(''); // Clear the input field
        setIsLoading(true); // Show the loading indicator

        try {
            // Send the user's message to our backend API route
            const response = await fetch('/api/generateContent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Create the bot's reply message object
            const botMessage: Message = { text: data.reply, sender: 'bot' };
            // Add the bot's message to the chat
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Failed to get bot reply:", error);
            // If there's an error, add an error message to the chat
            const errorMessage: Message = { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            // Hide the loading indicator, whether the request succeeded or failed
            setIsLoading(false);
        }
    };

    return (
        // The main container for the chat interface
        <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', minHeight: '400px', backgroundColor: 'white', zIndex: 9999999 }}>

            {/* Message Display Area */}
            <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        margin: '10px 0',
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            maxWidth: '75%',
                            padding: '10px 14px',
                            borderRadius: '20px',
                            backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef',
                            color: msg.sender === 'user' ? 'white' : 'black',
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {/* The "Bot is typing..." indicator */}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ display: 'inline-block', padding: '10px 14px', borderRadius: '20px', backgroundColor: '#e9ecef' }}>
                            Bot is typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '16px', borderTop: '1px solid #dee2e6' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flexGrow: 1, border: '1px solid #ced4da', borderRadius: '20px', padding: '10px', marginRight: '10px' }}
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <button type="submit" style={{ border: 'none', background: '#007bff', color: 'white', borderRadius: '20px', padding: '10px 15px', cursor: 'pointer' }} disabled={isLoading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;