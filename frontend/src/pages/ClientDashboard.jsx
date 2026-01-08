import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Car, UserCheck, AlertTriangle, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import SEO from '../components/SEO';

const ClientDashboard = () => {
    const [userName, setUserName] = useState("JOAO");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const name = user.displayName || user.email.split('@')[0];
                setUserName(name.split(' ')[0].toUpperCase());
            }
        });
        return () => unsubscribe();
    }, []);


    const modules = [
        {
            title: "CONDUTOR",
            subtitle: "Gerencie sua",
            highlight: "habilitação",
            color: "bg-[#00a859]", // Green
            icon: UserCheck,
            textColor: "text-white",
            bgImage: "url('/assets/bg-pattern-green.png')", // Placeholder for pattern
            delay: 0
        },
        {
            title: "VEÍCULOS",
            subtitle: "Acesso ao CRLV-e,",
            highlight: "venda digital",
            color: "bg-[#ffce00]", // Brand Yellow
            icon: Car,
            textColor: "text-[#111111]",
            bgImage: "url('/assets/bg-pattern-yellow.png')",
            delay: 0.1
        },
        {
            title: "INFRAÇÕES",
            subtitle: "Visualize e pague infrações",
            highlight: "com até 40% de desconto",
            color: "bg-[#1e3a8a]", // Deep Blue
            icon: AlertTriangle,
            textColor: "text-white",
            bgImage: "url('/assets/bg-pattern-blue.png')",
            delay: 0.2
        },
        {
            title: "EDUCAÇÃO",
            subtitle: "Conheça nossa",
            highlight: "plataforma de cursos",
            color: "bg-[#60a5fa]", // Light Blue
            icon: GraduationCap,
            textColor: "text-white", // or dark depending on contrast, Light blue usually needs dark text but image has white-ish? Let's verify contrast. Light blue 400 is readable with black or white. Image looks like white text.
            bgImage: "url('/assets/bg-pattern-lightblue.png')",
            delay: 0.3
        }
    ];



    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">
            <SEO title="Dashboard" description="Gerencie seus veículos e habilitação." />
            <DashboardHeader userName={userName} />

            <main className="container mx-auto px-4 pt-24">
                <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                    {modules.map((mod, index) => (
                        <ModuleCard key={index} {...mod} />
                    ))}
                </div>
            </main>
        </div>
    );
};

const ModuleCard = ({ title, subtitle, highlight, color, icon: Icon, textColor, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay }}
            className={`${color} ${textColor} rounded-2xl p-6 h-36 relative overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
        >
            {/* Background Decorative Curves (CSS only approximation for now) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-center h-full">
                <div className="w-2/3">
                    <h2 className="font-bold text-lg mb-1 tracking-wide">{title}</h2>
                    <p className="text-sm opacity-90 leading-tight">
                        {subtitle} <br />
                        <span className="font-bold text-base">{highlight}</span>
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        {/* Icon Shadow/Glow effect */}
                        <Icon size={48} className="drop-shadow-md opacity-90" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ClientDashboard;
