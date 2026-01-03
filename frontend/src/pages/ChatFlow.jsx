import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import ChatInputArea from '../components/ChatInputArea';
import { AnimatePresence } from 'framer-motion';

export default function ChatFlow() {
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState('greeting'); // greeting, service, plate, name, phone, finished
    const [userData, setUserData] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial Greeting
    useEffect(() => {
        // Add initial messages with a slight delay
        setTimeout(() => {
            addBotMessage("Olá! Eu sou o assistente da Descomplaca. Vamos resolver a documentação do seu veículo rapidinho! 🚗💨");
            setTimeout(() => {
                addBotMessage("O que você precisa hoje?");
                setCurrentStep('service');
            }, 1500);
        }, 500);
    }, []);

    const addBotMessage = (content) => {
        setMessages(prev => [...prev, { id: Date.now(), type: 'bot', content }]);
    };

    const addUserMessage = (content) => {
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', content }]);
    };

    const handleInput = (value) => {
        // Add User Message
        addUserMessage(value);

        // Process Step
        if (currentStep === 'service') {
            setUserData(prev => ({ ...prev, service: value }));
            setCurrentStep('none'); // Hide input while bot thinks

            setTimeout(() => {
                addBotMessage(`Ótima escolha (${value}). Para eu consultar os débitos, digite a <b>placa do veículo</b>.`);
                setCurrentStep('plate');
            }, 1000);
        }
        else if (currentStep === 'plate') {
            setUserData(prev => ({ ...prev, plate: value }));
            setCurrentStep('none');

            setTimeout(() => {
                addBotMessage("Encontrei o veículo! 🚘 Agora, como você prefere ser chamado?");
                setCurrentStep('name');
            }, 1500); // Simulate API call
        }
        else if (currentStep === 'name') {
            setUserData(prev => ({ ...prev, name: value }));
            setCurrentStep('none');

            setTimeout(() => {
                addBotMessage(`Prazer, <b>${value}</b>! Me passa seu WhatsApp para eu te enviar o orçamento detalhado em PDF? <br/><span class='text-xs text-gray-500'>(Prometo que é sem spam! 😉)</span>`);
                setCurrentStep('phone');
            }, 1000);
        }
        else if (currentStep === 'phone') {
            setUserData(prev => ({ ...prev, phone: value }));
            setCurrentStep('none');

            setTimeout(() => {
                // Trigger confetti here ideally
                addBotMessage("Tudo pronto! Já estou analisando seus dados. Clique abaixo para falar com nossos especialistas e parcelar em até 12x.");
                setCurrentStep('finished');
            }, 1000);
        }
        else if (currentStep === 'finished') {
            // Redirect or Open Link
            window.open(`https://wa.me/55${value.replace(/\D/g, '')}?text=Ola, vim pelo site e quero ver meu orçamento. Placa: ${userData.plate}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-bg flex flex-col font-sans relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>

            <ChatHeader />

            {/* Chat Container */}
            <main className="flex-1 w-full max-w-2xl mx-auto p-4 pb-48 flex flex-col">
                {/* Messages List */}
                <div className="flex-1 flex flex-col justify-end min-h-[50vh]">
                    <AnimatePresence mode='popLayout'>
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Dynamic Input Area */}
            <ChatInputArea step={currentStep} onSend={handleInput} loading={false} />
        </div>
    );
}
