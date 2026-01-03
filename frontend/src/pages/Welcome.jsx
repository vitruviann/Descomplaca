import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Welcome = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    const handleStart = async () => {
        if (!accepted) return;

        // Start session on backend
        try {
            const response = await fetch('http://127.0.0.1:8000/session/start', { method: 'POST' });
            const data = await response.json();
            localStorage.setItem('session_id', data.session_id);
            navigate('/triage');
        } catch (error) {
            console.error("Error starting session", error);
            // navigate anyway for demo? No, show error.
            alert("Erro ao conectar com o servidor local.");
        }
    };

    return (
        <div className="flex flex-col items-center text-center space-y-8 h-full justify-center">
            <div className="bg-blue-50 p-6 rounded-full">
                <Shield size={64} className="text-blue-600" />
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao Autoatendimento</h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Este terminal permite solicitar serviços do DETRAN/ES e Prefeitura de Vila Velha de forma rápida e segura.
                </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left text-sm max-w-lg">
                <h4 className="font-bold text-yellow-800 mb-2">Termo de Consentimento (LGPD)</h4>
                <p className="text-yellow-700">
                    Para prosseguir, você concorda que seus dados (Nome, CPF, CNH) serão coletados temporariamente apenas para o preenchimento dos formulários oficiais. Todos os dados serão apagados automaticamente ao final do atendimento ou após inatividade.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="consent"
                    className="w-5 h-5 text-blue-600"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                />
                <label htmlFor="consent" className="text-gray-700 font-medium cursor-pointer select-none">
                    Li e concordo com o tratamento dos meus dados.
                </label>
            </div>

            <button
                onClick={handleStart}
                disabled={!accepted}
                className={`px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg ${accepted
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                Iniciar Atendimento
            </button>
        </div>
    );
};

export default Welcome;
