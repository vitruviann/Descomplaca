import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const Progress = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const messages = [
        "Processando documentos...",
        "Conectando ao formulário da Prefeitura...",
        "Preenchendo dados automaticamente...",
        "Validando informações...",
        "Finalizando solicitação..."
    ];

    useEffect(() => {
        const runAutomation = async () => {
            const sessionId = localStorage.getItem('session_id');
            if (!sessionId) {
                // navigate('/');
                // return;
            }

            // MOCK STEPS VISUALIZATION while calling backend
            let currentMsg = 0;
            const msgInterval = setInterval(() => {
                if (currentMsg < messages.length - 1) {
                    currentMsg++;
                    setStep(currentMsg);
                }
            }, 1500);

            try {
                // Call backend to do the heavy lifting
                const res = await fetch(`http://127.0.0.1:8000/process/start/${sessionId}`, {
                    method: 'POST'
                });
                const data = await res.json();

                clearInterval(msgInterval);
                setStep(messages.length - 1); // Set to last message

                if (res.ok) {
                    setTimeout(() => navigate('/result'), 1000);
                } else {
                    alert("Erro no processamento: " + data.message);
                    navigate('/triage');
                }
            } catch (e) {
                console.error(e);
                clearInterval(msgInterval);
                // navigate('/result'); // Fallback for demo
                alert("Erro de conexão com o robô.");
            }
        };

        runAutomation();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                <div className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center text-blue-600">
                    <Loader size={32} />
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Aguarde um momento</h2>
                <div className="h-6 overflow-hidden">
                    <p key={step} className="text-gray-600 animate-pulse transition-all">
                        {messages[step]}
                    </p>
                </div>
            </div>

            <div className="w-64 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-blue-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / messages.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Progress;
