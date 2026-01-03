import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Car, FileText, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';

export default function ChatInputArea({ step, onSend, loading }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSend(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const services = [
        { id: 'licenciamento', label: 'Licenciamento', icon: FileText },
        { id: 'transferencia', label: 'Transferência', icon: Car },
        { id: 'duvidas', label: 'Dúvidas', icon: HelpCircle },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-brand-blue/10 p-4 md:p-6 pb-8 md:pb-8 z-40">
            <div className="max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">

                    {/* SCENARIO A: SERVICE SELECTION */}
                    {step === 'service' && (
                        <motion.div
                            key="service"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => onSend(service.label)}
                                    disabled={loading}
                                    className="group flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl transition-all hover:border-brand-yellow hover:bg-brand-yellow/10 active:scale-95"
                                >
                                    <service.icon className="w-8 h-8 text-brand-blue mb-2 group-hover:text-brand-black transition-colors" />
                                    <span className="font-hand text-xl text-brand-black">{service.label}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* SCENARIO B: PLATE INPUT */}
                    {step === 'plate' && (
                        <motion.div
                            key="plate"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="flex flex-col items-center w-full"
                        >
                            <div className="relative w-full max-w-sm">
                                <div className="absolute top-0 left-0 w-full h-4 bg-brand-blue rounded-t-lg z-10" />
                                <IMaskInput
                                    mask="aaa-0*00"
                                    prepareChar={(str) => str.toUpperCase()}
                                    value={inputValue}
                                    unmask={false}
                                    onAccept={(value) => setInputValue(value.toUpperCase())}
                                    onKeyDown={handleKeyDown}
                                    placeholder="ABC-1234"
                                    className="w-full text-center font-mono text-3xl md:text-4xl uppercase tracking-widest py-6 border-2 border-brand-blue/20 rounded-lg shadow-inner focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all pt-8"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={inputValue.length < 7 || loading}
                                    className="absolute right-3 bottom-3 p-2 rounded-full bg-brand-green text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors shadow-lg"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 font-sans">Digite a placa do seu veículo</p>
                        </motion.div>
                    )}

                    {/* SCENARIO C: NAME / GENERIC INPUT */}
                    {step === 'name' && (
                        <motion.div
                            key="name"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="flex gap-2 w-full"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Seu nome aqui..."
                                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || loading}
                                className="p-3 rounded-full bg-brand-green text-white disabled:opacity-50 hover:bg-green-600 shadow-md transition-all active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </motion.div>
                    )}

                    {/* SCENARIO D: PHONE INPUT */}
                    {step === 'phone' && (
                        <motion.div
                            key="phone"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="flex gap-2 w-full"
                        >
                            <IMaskInput
                                mask="(00) 00000-0000"
                                value={inputValue}
                                unmask={false}
                                onAccept={(value) => setInputValue(value)}
                                onKeyDown={handleKeyDown}
                                placeholder="(00) 99999-9999"
                                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                autoFocus
                                inputMode="numeric"
                            />
                            <button
                                onClick={handleSend}
                                disabled={inputValue.length < 14 || loading}
                                className="p-3 rounded-full bg-brand-green text-white disabled:opacity-50 hover:bg-green-600 shadow-md transition-all active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </motion.div>
                    )}

                    {/* SCENARIO E: FINISHED / CTA */}
                    {step === 'finished' && (
                        <motion.div
                            key="finished"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full"
                        >
                            <button
                                onClick={() => onSend('whatsapp')}
                                className="w-full py-4 bg-brand-green text-white rounded-full font-bold text-lg md:text-xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-3 animate-pulse"
                            >
                                <span>FINALIZAR NO WHATSAPP</span>
                                <ArrowRight size={24} />
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
