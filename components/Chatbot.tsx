'use client'
import { useEffect, useState } from "react";

type Message = { sender: 'user' | 'bot'; text: string };

export default function GeminiSample() {
    const [apiResult, setApiResult] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]) // Explicitly typed messages state
    const [input, setInput] = useState('') // Added missing input state

    // Function to handle sending messages
    const handleSendMessage = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()

        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('') // Clear input

        // Add user message to chat
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }])
        setIsLoading(true)

        try {
            const res = await fetch('/api/generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const reader = res.body?.getReader()
            if (!reader) {
                throw new Error('No reader available')
            }

            const decoder = new TextDecoder()
            let botResponse = ''

            // Add empty bot message that will be updated with streaming content
            setMessages(prev => [...prev, { sender: 'bot', text: '' }])

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                botResponse += chunk

                // Update the last message (bot's response) with accumulated text
                setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].text = botResponse
                    return newMessages
                })
            }

        } catch (error) {
            console.error('Error fetching response:', error)
            // Add error message to chat
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    // Initial demo message (optional - you can remove this useEffect)
    useEffect(() => {
        // Add a welcome message when component mounts
        setMessages([{
            sender: 'bot',
            text: 'Hello! I\'m powered by Gemini AI. How can I help you today?'
        }])
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '60vh',
            minHeight: '400px',
            backgroundColor: 'white',
            zIndex: 9999999,
            border: '1px solid #dee2e6',
            borderRadius: '8px'
        }}>
            {/* Message Display Area */}
            <div style={{
                flexGrow: 1,
                padding: '16px',
                overflowY: 'auto',
                backgroundColor: '#f8f9fa'
            }}>
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
                            wordWrap: 'break-word'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* The "Bot is typing..." indicator */}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '10px 14px',
                            borderRadius: '20px',
                            backgroundColor: '#e9ecef',
                            fontStyle: 'italic',
                            color: '#6c757d'
                        }}>
                            Bot is typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSendMessage}
                style={{
                    display: 'flex',
                    padding: '16px',
                    borderTop: '1px solid #dee2e6',
                    backgroundColor: 'white'
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flexGrow: 1,
                        border: '1px solid #ced4da',
                        borderRadius: '20px',
                        padding: '10px 15px',
                        marginRight: '10px',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <button
                    type="submit"
                    style={{
                        border: 'none',
                        background: isLoading ? '#6c757d' : '#007bff',
                        color: 'white',
                        borderRadius: '20px',
                        padding: '10px 15px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        minWidth: '60px',
                        fontSize: '14px'
                    }}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    )
}