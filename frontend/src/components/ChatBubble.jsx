import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const TypingIndicator = () => (
    <div className="flex gap-1 px-2 py-1">
        {[0, 1, 2].map((dot) => (
            <motion.div
                key={dot}
                className="w-1.5 h-1.5 bg-brand-blue/50 rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: dot * 0.2,
                }}
            />
        ))}
    </div>
);

export default function ChatBubble({ message }) {
    const isBot = message.type === 'bot';
    const [showContent, setShowContent] = useState(!isBot); // Users show immediately, bots type first

    useEffect(() => {
        if (isBot) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 1000); // Fake typing delay
            return () => clearTimeout(timer);
        }
    }, [isBot]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            layout
            className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>

                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isBot ? 'bg-white border border-brand-green/20' : 'bg-brand-blue'
                    }`}>
                    {isBot ? (
                        <Bot size={18} className="text-brand-green" />
                        // Ideally replace with Descomplaca Mascot Icon if available
                    ) : (
                        <User size={18} className="text-white" />
                    )}
                </div>

                {/* Bubble */}
                <div
                    className={`relative px-4 py-3 shadow-sm text-sm md:text-base leading-relaxed ${isBot
                            ? 'bg-white text-brand-black rounded-2xl rounded-bl-none border border-brand-blue/10'
                            : 'bg-brand-blue text-white rounded-2xl rounded-br-none font-medium'
                        }`}
                >
                    {isBot && !showContent ? (
                        <TypingIndicator />
                    ) : (
                        <motion.div
                            initial={isBot ? { opacity: 0 } : false}
                            animate={{ opacity: 1 }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: message.content }} />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
