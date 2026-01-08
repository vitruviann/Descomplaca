
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Shield } from 'lucide-react';
import { subscribeToMessages, sendMessage } from '../api';
import { auth } from '../firebase'; // Need auth to know if "isMe" in some cases, or passed prop

const SecureChat = ({ orderId, isDispatcher = false }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        // Subscribe to real-time updates
        const unsubscribe = subscribeToMessages(orderId, (newMessages) => {
            setMessages(newMessages);
        });
        return () => unsubscribe();
    }, [orderId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await sendMessage({
                order_id: orderId,
                content: input,
                is_from_dispatcher: isDispatcher,
                // Add user ID if available, for now rely on is_from_dispatcher flag
                sender_id: auth.currentUser?.uid || 'anon'
            });
            setInput('');
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-gray-700">Chat Seguro</span>
                </div>
                <span className="text-xs text-gray-400">Criptografado ponta a ponta (Simulado)</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        Nenhuma mensagem ainda. Inicie a conversa!
                    </div>
                )}
                {messages.map((msg) => {
                    // Determine alignment:
                    // If isDispatcher=true (I am dispatcher): dispatcher msgs are MINE (right), user msgs are THEIRS (left)
                    // If isDispatcher=false (I am client): dispatcher msgs are THEIRS (left), user msgs are MINE (right)

                    const isMe = isDispatcher ? msg.is_from_dispatcher : !msg.is_from_dispatcher;

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${isMe
                                ? 'bg-brand-yellow text-brand-black rounded-tr-none'
                                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold opacity-70">
                                        {msg.is_from_dispatcher ? 'Despachante' : 'Você'}
                                    </span>
                                    {msg.is_from_dispatcher && <Shield size={10} className="text-blue-600" />}
                                </div>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <span className="text-[10px] opacity-50 block text-right mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                />
                <button
                    type="submit"
                    className="w-12 h-12 bg-brand-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default SecureChat;
