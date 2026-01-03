import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Upload, Camera, FileText, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Steps = [
    { id: 1, title: "Vistoria", icon: Camera },
    { id: 2, title: "Dados", icon: FileText },
    { id: 3, title: "Documentos", icon: Upload },
    { id: 4, title: "Análise", icon: ShieldCheck },
    { id: 5, title: "Estampagem", icon: Truck },
];

const ReplacementWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        placa: '',
        renavam: '',
        cpf: ''
    });

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
        else navigate('/triage');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 text-center">
                        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">1. Vistoria Eletrônica</h3>
                            <p className="text-gray-600 mb-6 text-lg">
                                Antes de iniciar, você precisa ter realizado a vistoria do veículo em uma Empresa Credenciada (ECV).
                            </p>
                            <div className="flex flex-col items-center gap-4 text-blue-800 bg-white p-4 rounded-xl shadow-sm">
                                <span className="font-semibold">Itens verificados:</span>
                                <ul className="text-left list-disc list-inside text-gray-600">
                                    <li>Documentos pessoais e do veículo</li>
                                    <li>Condições das placas atuais</li>
                                    <li>Numeração de chassi e motor</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Se você já fez a vistoria, avance para o próximo passo.</p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Dados do Veículo</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo</label>
                                    <input
                                        type="text"
                                        className="w-full text-2xl font-mono p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 uppercase placeholder-gray-300"
                                        placeholder="ABC-1234"
                                        value={formData.placa}
                                        onChange={e => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Renavam</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                                        placeholder="00000000000"
                                        value={formData.renavam}
                                        onChange={e => setFormData({ ...formData, renavam: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Proprietário</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Documentação</h3>
                            <p className="text-gray-600 mb-6">Escaneie ou tire uma foto dos documentos. A imagem deve estar nítida.</p>

                            <div className="border-3 border-dashed border-gray-300 rounded-2xl p-10 hover:bg-gray-50 transition-colors cursor-pointer group">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 mb-4" />
                                <p className="text-gray-500 font-medium group-hover:text-blue-600">Toque aqui para enviar os documentos</p>
                                <p className="text-xs text-gray-400 mt-2">(CRLV, CNH ou RG, Laudo Vistoria)</p>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 text-center py-10">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="inline-block p-6 bg-blue-50 rounded-full mb-6"
                        >
                            <ShieldCheck className="w-16 h-16 text-blue-600" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-800">Em Análise...</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Estamos validando seus dados junto ao sistema do DETRAN|ES. Isso levará apenas alguns segundos.
                        </p>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 text-center">
                        <div className="bg-green-50 p-8 rounded-3xl border border-green-200">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-green-800 mb-2">Solicitação Aprovada!</h3>
                            <p className="text-green-700 mb-8">
                                Sua solicitação foi processada com sucesso. Utilize o código abaixo na estampadora.
                            </p>

                            <div className="bg-white border-2 border-green-200 rounded-xl p-6 mb-8 max-w-xs mx-auto shadow-sm">
                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Código de Autorização</p>
                                <p className="text-4xl font-mono font-bold text-gray-900 tracking-widest">DET-8X2Y</p>
                            </div>

                            <p className="text-sm text-gray-500">
                                Enviamos também um SMS e E-mail com este código.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 relative z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Substituição de Placas</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>

            {/* Steps Progress */}
            <div className="bg-white border-b border-gray-100 pb-4 pt-2">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex justify-between items-center relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        {/* Active Progress */}
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / (Steps.length - 1)) * 100}%` }}
                        ></div>

                        {Steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = step.id <= currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                                                : 'bg-white border-gray-300 text-gray-400'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs mt-2 font-medium transition-colors ${isActive ? 'text-blue-700' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 sticky bottom-0">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Voltar
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            {currentStep === 4 ? 'Aguardar...' : 'Continuar'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all"
                        >
                            Concluir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReplacementWizard;
