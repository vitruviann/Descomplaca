import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, FileText, User } from 'lucide-react';

const Triage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState({});

    useEffect(() => {
        // Fetch services from backend
        fetch('http://127.0.0.1:8000/services')
            .then(res => res.json())
            .then(data => setServices(data))
            .catch(err => console.error("Error fetching services", err));
    }, []);

    const handleSelect = (serviceId) => {
        // Save selection to local storage or context
        localStorage.setItem('selected_service', serviceId);
        navigate('/auth');
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Selecione o Serviço Desejado</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Manual Entry for Plate Replacement */}
                <button
                    onClick={() => navigate('/replacement')}
                    className="bg-white border text-left p-6 rounded-xl hover:shadow-md hover:border-blue-500 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl">NOVO</div>
                    <div className="flex items-center mb-2 text-blue-900 group-hover:text-blue-600">
                        <Car className="mr-2" />
                        <span className="font-bold text-lg">Substituição de Placas</span>
                    </div>
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                        <li>Placas danificadas ou perdidas</li>
                        <li>Padrão Mercosul</li>
                    </ul>
                </button>

                {Object.entries(services).map(([key, service]) => (
                    <button
                        key={key}
                        onClick={() => handleSelect(key)}
                        className="bg-white border text-left p-6 rounded-xl hover:shadow-md hover:border-blue-500 transition-all group"
                    >
                        <div className="flex items-center mb-2 text-blue-900 group-hover:text-blue-600">
                            {key.includes("cnh") ? <User className="mr-2" /> : <Car className="mr-2" />}
                            <span className="font-bold text-lg">{service.name}</span>
                        </div>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                            {service.requirements.slice(0, 2).map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </button>
                ))}
            </div>

            {Object.keys(services).length === 0 && (
                <div className="text-center text-gray-500 mt-10">Carregando serviços...</div>
            )}
        </div>
    );
};

export default Triage;
