import React from 'react';
import { motion } from 'framer-motion';

const SolicitationIntro = ({ onStart }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                        Para recomendar a solução ideal pra você, precisamos entender sua demanda.
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Sua jornada é acompanhada de perto pela Despachante Digital. Criamos um fluxo que reúne as informações essenciais do seu caso e as combina com nossa expertise em trânsito.
                    </p>
                    <p className="text-gray-900 font-medium mb-8">
                        É rápido, simples e pensado para respeitar o seu tempo.
                        Você pode começar agora!
                    </p>

                    <button
                        onClick={onStart}
                        className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 shadow-lg"
                    >
                        Iniciar
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden md:block"
                >
                    {/* Abstract/Clean Illustration */}
                    <div className="aspect-square rounded-3xl bg-gray-50 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-transparent opacity-50"></div>
                        <div className="w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10">
                            <div className="text-yellow-500">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SolicitationIntro;
