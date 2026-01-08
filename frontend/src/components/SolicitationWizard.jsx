
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { createOrder } from '../api';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth';

const SolicitationWizard = () => {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        plate: '',
        renavam: '',
        service: '',
        description: '',
        name: '',
        email: '',
        phone: '',
        city: 'Vila Velha', // Default or detect
        state: 'ES'
    });
    const [isValid, setIsValid] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const navigate = useNavigate();

    // Listen to auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    name: currentUser.displayName || prev.name,
                    email: currentUser.email || prev.email
                }));
            }
        });
        return () => unsubscribe();
    }, []);

    const handleNext = async () => {
        if (step === 2) {
            // Check auth before submit
            if (!user) {
                // Save state and redirect to auth? 
                // For MVP, simple alert or redirect
                alert("Por favor, faça login para finalizar a solicitação.");
                navigate('/auth'); // Assuming /auth is the route for Auth.jsx
                return;
            }
            await handleSubmit();
        } else if (isValid) {
            setStep((prev) => prev + 1);
            setIsValid(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const orderPayload = {
                vehicle_plate: formData.plate,
                vehicle_renavam: formData.renavam,
                service_type: formData.service,
                description: formData.description,
                city: formData.city,
                state: formData.state,
                owner_id: user.uid, // Use Firebase UID
                owner_email: user.email // Store email for reference
            };

            const response = await createOrder(orderPayload);
            setCreatedOrder(response);
            setStep(3); // Success Screen
        } catch (error) {
            console.error("Failed to create order", error);
            alert("Erro ao criar solicitação. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Real-time Validation Effect
    useEffect(() => {
        if (step === 0) { // Plate Validation
            const cleanPlate = formData.plate.replace(/[^a-zA-Z0-9]/g, '');
            setIsValid(cleanPlate.length === 7);
        } else if (step === 1) { // Service Validation
            setIsValid(!!formData.service);
        } else if (step === 2) { // Contact Validation
            const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
            setIsValid(
                formData.name.trim().length > 2 &&
                cleanPhone.length >= 10 &&
                emailValid
            );
        }
    }, [formData, step]);

    // Validation Status UI Helper
    const InputStatusIcon = ({ valid }) => {
        if (!formData.plate && step === 0) return null;
        if (valid) return <CheckCircle className="text-green-500" size={24} />;
        return <AlertCircle className="text-red-500" size={24} />;
    };

    const questions = [
        {
            id: 'vehicle',
            title: 'Dados do Veículo',
            description: 'Informe a placa e opcionalmente o Renavam.',
            component: (
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                    <div className="relative">
                        <label className="text-sm font-bold text-gray-500 mb-1 block">PLACA DO VEÍCULO</label>
                        <IMaskInput
                            mask={[
                                { mask: 'AAA-0000' },
                                { mask: 'AAA0A00' }
                            ]}
                            prepare={(str) => str.toUpperCase()}
                            placeholder="ABC-1234"
                            className={`w-full text-4xl font-bold bg-transparent border-b-2 outline-none py-2 text-center uppercase tracking-widest transition-colors ${isValid
                                ? 'border-brand-yellow text-brand-black'
                                : formData.plate.length > 0 ? 'border-red-500 text-red-500' : 'border-gray-300'
                                } focus:border-brand-yellow placeholder:text-gray-300`}
                            value={formData.plate}
                            autoFocus
                            onAccept={(value) => handleInput('plate', value)}
                        />
                        <div className="absolute right-0 top-8 mr-4">
                            {formData.plate.length > 0 && <InputStatusIcon valid={isValid} />}
                        </div>
                    </div>

                    <div className="relative mt-4">
                        <label className="text-sm font-bold text-gray-500 mb-1 block">RENAVAM (OPCIONAL)</label>
                        <IMaskInput
                            mask="00000000000"
                            placeholder="00000000000"
                            className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-300 outline-none py-2 text-center tracking-widest focus:border-brand-yellow placeholder:text-gray-300"
                            value={formData.renavam}
                            onAccept={(value) => handleInput('renavam', value)}
                        />
                    </div>

                    <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 md:static md:border-0 md:p-0 md:bg-transparent z-20">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#E6C200' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={!isValid}
                            className="w-full bg-brand-yellow text-brand-black font-bold py-4 rounded-xl shadow-md uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Continuar <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </div>
            )
        },
        {
            id: 'service',
            title: 'Qual serviço você busca?',
            description: 'Selecione e descreva seu caso.',
            component: (
                <div className="flex flex-col w-full max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {['Licenciamento', 'Transferência', '1º Emplacamento', 'Débitos', 'Outros'].map((opt) => (
                            <motion.button
                                key={opt}
                                onClick={() => handleInput('service', opt)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${formData.service === opt
                                    ? 'bg-yellow-50 border-brand-yellow shadow-md'
                                    : 'bg-white border-gray-100 hover:border-brand-yellow'
                                    }`}
                            >
                                <span className="text-lg font-bold text-gray-800">{opt}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="mb-24 md:mb-0">
                        <label className="text-sm font-bold text-gray-500 mb-2 block text-left">DESCREVA SEU CASO (OPCIONAL)</label>
                        <textarea
                            className="w-full p-4 rounded-xl border-2 border-gray-200 outline-none focus:border-brand-yellow min-h-[100px]"
                            placeholder="Ex: Preciso transferir o carro do meu pai falecido..."
                            value={formData.description}
                            onChange={(e) => handleInput('description', e.target.value)}
                        />

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#E6C200' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={!formData.service}
                            className="w-full bg-brand-yellow text-brand-black font-bold py-4 rounded-xl shadow-md uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            Continuar <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Para onde enviamos a resposta?',
            description: 'Informe seus dados para contato.',
            component: (
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto mb-20 md:mb-0">
                    <input
                        type="text"
                        placeholder="Seu Nome Completo"
                        className="text-xl font-medium bg-transparent border-b border-gray-300 focus:border-brand-yellow outline-none py-3 w-full"
                        value={formData.name}
                        autoFocus
                        onChange={(e) => handleInput('name', e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Seu E-mail"
                        className="text-xl font-medium bg-transparent border-b border-gray-300 focus:border-brand-yellow outline-none py-3 w-full"
                        value={formData.email}
                        onChange={(e) => handleInput('email', e.target.value)}
                    />
                    <IMaskInput
                        mask="(00) 00000-0000"
                        placeholder="Seu WhatsApp"
                        inputMode="tel"
                        className="text-xl font-medium bg-transparent border-b border-gray-300 focus:border-brand-yellow outline-none py-3 w-full"
                        value={formData.phone}
                        onAccept={(value) => handleInput('phone', value)}
                    />

                    <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 md:static md:border-0 md:p-0 md:bg-transparent z-20">
                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#E6C200' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            disabled={!isValid || isLoading}
                            className="w-full bg-brand-yellow text-brand-black font-bold py-4 rounded-xl shadow-md uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Finalizar Solicitação <Check size={20} /></>}
                        </motion.button>
                    </div>
                </div>
            )
        },
        {
            id: 'finish',
            title: 'Tudo pronto!',
            description: 'Recebemos sua solicitação. Em instantes um especialista analisará seu caso.',
            component: (
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        type="spring"
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4"
                    >
                        <Check size={48} />
                    </motion.div>
                    <p className="text-gray-600 max-w-md">
                        Acompanhe seu e-mail e WhatsApp. Assim que tivermos uma proposta, você será notificado.
                    </p>
                    <a href="/" className="text-gray-500 hover:text-brand-black hover:underline underline-offset-4">
                        Voltar para o início
                    </a>
                </div>
            )
        }
    ];

    const currentQuestion = questions[step];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-24 px-6 md:px-0 font-sans">
            <div className="container mx-auto max-w-4xl flex-1 flex flex-col justify-center pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center text-center w-full"
                    >
                        {step < 3 && (
                            <span className="text-sm font-bold text-yellow-600 mb-4 tracking-uppercase">
                                PASSO {step + 1} DE 3
                            </span>
                        )}
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 max-w-2xl">
                            {currentQuestion.title}
                        </h2>
                        <p className="text-xl text-gray-500 mb-12 max-w-xl">
                            {currentQuestion.description}
                        </p>
                        {currentQuestion.component}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SolicitationWizard;
