import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Car, CheckCircle, Clock, Shield, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import ProcessStep from '../components/ProcessStep';

function Home() {
    const services = [
        {
            icon: FileText,
            title: "Licenciamento",
            description: "Regularize seu veículo sem sair de casa. Pagamento facilitado e entrega digital.",
            href: "/solicitar"
        },
        {
            icon: Car,
            title: "Transferência",
            description: "Processo completo de transferência de propriedade com segurança e agilidade.",
            href: "/solicitar"
        },
        {
            icon: CheckCircle,
            title: "Primeiro Emplacamento",
            description: " emplacamento do seu veículo zero km com total comodidade.",
            href: "/solicitar"
        },
        {
            icon: Shield,
            title: "Débitos e Multas",
            description: "Consulta e parcelamento de débitos veiculares em até 12x no cartão.",
            href: "/solicitar"
        }
    ];

    const steps = [
        {
            number: 1,
            title: "Solicitação Online",
            description: "Preencha o formulário ou chame no WhatsApp para iniciar seu atendimento."
        },
        {
            number: 2,
            title: "Análise Gratuita",
            description: "Nossa equipe avalia a situação do seu veículo e apresenta a melhor solução."
        },
        {
            number: 3,
            title: "Problema Resolvido",
            description: "Regularizamos tudo e você recebe a documentação onde estiver."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-400/10 -skew-x-12 transform translate-x-20 z-0"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                                Conectando você a <span className="text-yellow-500">soluções de trânsito</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
                                Regularize seu veículo de forma 100% online, segura e rápida.
                                Impossível ignorar a burocracia do DETRAN e deixe que a Despachante Digital cuide de tudo.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/solicitar" className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105 shadow-lg text-center">
                                    Resolver Agora
                                </Link>
                                <button className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-black transition-colors">
                                    Falar no WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicos" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Serviços Especializados</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Soluções completas para todas as suas necessidades veiculares, com a confiança de quem entende do assunto.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="como-funciona" className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 hidden md:block transform -translate-y-12"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-gray-900">Como Funciona</h2>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-0">
                        {steps.map((step, index) => (
                            <ProcessStep key={index} {...step} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us / Benefits */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Por que escolher a <span className="text-yellow-400">Despachante Digital</span>?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Agilidade Comprovada</h3>
                                        <p className="text-gray-400">Processos resolvidos em tempo recorde, sem filas e sem espera.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
                                        <p className="text-gray-400">Somos credenciados e atuamos com total transparência e segurança de dados.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 shrink-0">
                                        <HelpCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Suporte Humanizado</h3>
                                        <p className="text-gray-400">Atendimento por pessoas reais, prontas para tirar suas dúvidas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
                            {/* Placeholder for an image or form */}
                            <div className="aspect-square rounded-2xl bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-600">Imagem Ilustrativa / Form</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contato" className="bg-white pt-20 pb-10 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-6">
                                <div className="bg-yellow-400 p-2 rounded-lg">
                                    <Car size={24} className="text-black" />
                                </div>
                                <span className="text-gray-900">Despachante<span className="text-yellow-500">Digital</span></span>
                            </div>
                            <p className="text-gray-500 max-w-sm">
                                Sua solução completa para serviços de despachante online.
                                Simples, rápido e seguro.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Links Rápidos</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Serviços</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Como Funciona</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Dúvidas Frequentes</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidade</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Contato</h4>
                            <ul className="space-y-4 text-gray-500">
                                <li className="flex items-center gap-3">
                                    <Phone size={18} className="text-yellow-500" />
                                    <span>(11) 99999-9999</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={18} className="text-yellow-500" />
                                    <span>contato@descomplaca.com.br</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin size={18} className="text-yellow-500" />
                                    <span>Vila Velha, ES</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Despachante Digital. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
