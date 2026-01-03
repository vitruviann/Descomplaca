import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, LogOut } from 'lucide-react';

const Result = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(10); // Auto logout in 10s

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={64} className="text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Solicitação Enviada!</h2>
            <p className="text-gray-600 max-w-md">
                Seu protocolo foi gerado com sucesso. O documento oficial será enviado para o e-mail cadastrado no Gov.br.
            </p>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg w-full max-w-xs">
                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Protocolo</div>
                <div className="text-2xl font-mono text-gray-800 tracking-widest">DET-2025-{Math.floor(Math.random() * 10000)}</div>
            </div>

            <div className="pt-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                    <LogOut size={16} />
                    <span>Encerrar Sessão Agora ({timeLeft}s)</span>
                </button>
            </div>
        </div>
    );
};

export default Result;
