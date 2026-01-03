import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Aguardando início do login...");
    const [loading, setLoading] = useState(false);

    const startLogin = async () => {
        setLoading(true);
        setStatus("Iniciando navegador seguro...");
        try {
            const res = await fetch('http://127.0.0.1:8000/login/govbr/start', { method: 'POST' });
            if (res.ok) {
                setStatus("Aguardando leitura do QR Code no Gov.br...");
                // In real app, we would poll for success or show the mirrored screen
                // For this stub, we simulate success after a delay or manual button
            } else {
                setStatus("Erro ao iniciar login.");
            }
        } catch (e) {
            setStatus("Erro de conexão.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Autenticação Gov.br</h2>

            <div className="bg-white p-8 rounded-xl shadow-inner border border-gray-200 flex flex-col items-center">
                <div className="bg-gray-100 w-64 h-64 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    {/* Placeholder for QR Code Mirroring */}
                    <QrCode size={100} className="text-gray-400 opacity-20" />
                    <p className="absolute text-center text-xs text-gray-500 w-full px-4">
                        O QR Code do Gov.br aparecerá na tela do navegador seguro.
                    </p>
                </div>

                <p className="text-sm font-medium text-blue-800 mb-4">{status}</p>

                <div className="flex space-x-4">
                    <button
                        onClick={startLogin}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Carregando..." : "Exibir QR Code"}
                    </button>

                    <button
                        onClick={() => navigate('/upload')} // Bypass for demo
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300"
                    >
                        Simular Sucesso
                    </button>
                </div>
            </div>

            <div className="text-xs text-gray-400 max-w-md text-center">
                Utilize o aplicativo do Gov.br no seu celular para ler o código.
                Nenhuma senha será digitada neste terminal.
            </div>
        </div>
    );
};

export default Auth;
