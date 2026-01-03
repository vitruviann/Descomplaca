
import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Maybe a different header for Dispatcher?
import { listOrders, createProposal } from '../api';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMaskInput } from 'react-imask';

const DispatcherDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const data = await listOrders(); // Fetch all OPEN orders
            setLeads(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header /> {/* Should act as Dispatcher Nav */}
            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-6">

                {/* Lead List */}
                <div className="w-full md:w-1/3">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Novas Solicitações</h2>
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <div className="space-y-4">
                            {leads.map(lead => (
                                <div
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer border-2 transition-all hover:border-brand-yellow ${selectedLead?.id === lead.id ? 'border-brand-yellow ring-2 ring-yellow-100' : 'border-transparent'}`}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-gray-900">{lead.service_type}</span>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{lead.city}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{lead.description || "Sem descrição."}</p>
                                    <div className="mt-3 text-xs font-mono bg-gray-50 p-1 rounded inline-block">
                                        {lead.vehicle_plate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Proposal Editor */}
                <div className="w-full md:w-2/3">
                    {selectedLead ? (
                        <ProposalForm lead={selectedLead} onSuccess={() => {
                            setSelectedLead(null);
                            fetchLeads(); // Refresh list to remove handled lead if logic dictates
                        }} />
                    ) : (
                        <div className="bg-white rounded-2xl h-full flex flex-col items-center justify-center text-gray-400 p-10 border border-gray-200 border-dashed">
                            <p>Selecione uma solicitação para enviar proposta.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProposalForm = ({ lead, onSuccess }) => {
    const [form, setForm] = useState({
        fee_value: '',
        tax_value: '',
        estimated_days: '',
        description: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === 'description') {
            // Basic Frontend Validation for Leakage (Visual only, Backend enforces)
            if (e.target.value.match(/(\d{8,})|(@)/)) {
                setError("Atenção: Não envie dados de contato antes do fechamento.");
            } else {
                setError(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                order_id: lead.id,
                dispatcher_id: 2, // Mock Dispatcher ID
                fee_value: parseFloat(form.fee_value),
                tax_value: parseFloat(form.tax_value),
                estimated_days: parseInt(form.estimated_days),
                description: form.description
            };
            await createProposal(payload);
            alert("Proposta enviada com sucesso!");
            onSuccess();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Erro ao enviar proposta.";
            alert("Erro: " + msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Enviar Proposta para {lead.vehicle_plate}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Honorários (R$)</label>
                        <input
                            name="fee_value"
                            type="number"
                            step="0.01"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none font-mono"
                            placeholder="0.00"
                            value={form.fee_value}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">Sua comissão.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Taxas Estatais (R$)</label>
                        <input
                            name="tax_value"
                            type="number"
                            step="0.01"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none font-mono"
                            placeholder="0.00"
                            value={form.tax_value}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">IPVA, Multas, etc.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prazo Estimado (Dias Úteis)</label>
                    <input
                        name="estimated_days"
                        type="number"
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none"
                        placeholder="Ex: 5"
                        value={form.estimated_days}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mensagem de Abordagem</label>
                    <textarea
                        name="description"
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none h-32"
                        placeholder="Olá, sou despachante credenciado. Consigo resolver isso em..."
                        value={form.description}
                        onChange={handleChange}
                    />
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="w-full bg-brand-yellow text-brand-black font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : <>Enviar Proposta <Send size={20} /></>}
                </motion.button>
            </form>
        </div>
    );
};

export default DispatcherDashboard;
