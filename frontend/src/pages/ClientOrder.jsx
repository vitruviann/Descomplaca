
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { getOrder, listProposals, checkoutProposal } from '../api';
import { Loader2, DollarSign, Clock, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false); // Added state for review modal

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderData = await getOrder(id);
                setOrder(orderData);

                if (orderData.status === 'FINISHED') {
                    setShowReviewModal(true);
                }

                if (orderData.status !== 'OPEN') {
                    // Fetch proposals even if closed, to show history?
                    // Logic: If PROPOSAL_RECEIVED, fetch proposals.
                }
                const proposalsData = await listProposals(id);
                setProposals(proposalsData);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCheckout = async (proposalId) => {
        try {
            const result = await checkoutProposal(proposalId);
            if (result.payment_url) {
                window.location.href = result.payment_url;
            } else {
                alert("Erro ao gerar pagamento via Asaas.");
            }
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Falha no checkout.");
        }
    };

    // Review Logic
    const handleReviewSubmit = async (rating, comment) => {
        try {
            await api.post('/reviews/', { order_id: order.id, rating, comment });
            setShowReviewModal(false);
            alert("Avaliação enviada! Obrigado.");
        } catch (error) {
            console.error("Review failed", error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-yellow" size={48} /></div>;

    if (!order) return <div className="p-10 text-center">Pedido não encontrado.</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4 text-center">Avalie o Serviço</h3>
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => handleReviewSubmit(star, "Excelente!")} className="text-yellow-400 hover:scale-110 transition-transform">
                                    <Star size={32} fill="currentColor" />
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-gray-500 text-sm">Clique em uma estrela para avaliar rapidinho.</p>
                        <button onClick={() => setShowReviewModal(false)} className="mt-6 w-full py-2 text-gray-400 text-sm hover:text-gray-600">Pular</button>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-4 pt-24 pb-12">

                {/* Order Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">PEDIDO #{order.id}</span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-1">{order.service_type}</h1>
                            <div className="flex items-center gap-2 mt-2 text-gray-600">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{order.vehicle_plate}</span>
                                <span>•</span>
                                <span>{order.city} - {order.state}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <StatusBadge status={order.status} />
                            <span className="text-sm text-gray-400 mt-2">Criado em {new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Proposals Section */}
                {order.status === 'OPEN' || order.status === 'PROPOSAL_RECEIVED' ? (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Propostas Recebidas ({proposals.length})</h2>

                        {proposals.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl text-gray-400 border-2 border-dashed border-gray-200">
                                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                <p className="text-lg">Aguardando despachantes parceiros...</p>
                                <p className="text-sm">Você será notificado assim que receber uma oferta.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {proposals.map((proposal) => (
                                    <ProposalCard key={proposal.id} proposal={proposal} onSelect={() => handleCheckout(proposal.id)} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* Execution Phase */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <SecureChat orderId={order.id} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
                            <h3 className="font-bold text-gray-900 mb-4">Status do Processo</h3>
                            <Timeline status={order.status} />

                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-bold text-sm text-gray-700 mb-2">Documentos</h4>
                                {/* Placeholder for Document List */}
                                <p className="text-xs text-gray-500">Nenhum documento anexado.</p>
                                <button className="mt-2 text-brand-black text-sm font-bold underline">Enviar Documento</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Timeline = ({ status }) => {
    const steps = [
        { id: 'PAID', label: 'Pagamento Confirmado' },
        { id: 'IN_PROGRESS', label: 'Em Análise / Execução' },
        { id: 'CONCLUDED', label: 'Concluído' },
        { id: 'FINISHED', label: 'Entregue' }
    ];

    // Simple index check logic
    const currentIndex = steps.findIndex(s => s.id === status);
    // If status is not in execution flow (e.g. cancelled), handle gracefully? Assuming happy path for MVP.
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="space-y-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

            {steps.map((step, index) => {
                const isActive = index <= activeIndex;
                const isCurrent = index === activeIndex;
                return (
                    <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${isActive ? 'border-green-500' : 'border-gray-200'}`}>
                            {isActive && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                        </div>
                        <span className={`text-sm ${isActive ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                );
            })}
        </div>
    );
};


const StatusBadge = ({ status }) => {
    const map = {
        'OPEN': { color: 'bg-blue-100 text-blue-700', label: 'Em Aberto' },
        'PROPOSAL_RECEIVED': { color: 'bg-yellow-100 text-yellow-800', label: 'Propostas Recebidas' },
        'PAID': { color: 'bg-green-100 text-green-700', label: 'Pago / Em Andamento' },
        'CONCLUDED': { color: 'bg-gray-800 text-white', label: 'Concluído' }
    };
    const config = map[status] || map['OPEN'];
    return (
        <span className={`${config.color} px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide`}>
            {config.label}
        </span>
    );
};

const ProposalCard = ({ proposal, onSelect }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        D
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Despachante Parceiro</h3>
                        <div className="flex items-center text-xs text-yellow-500 gap-1">
                            <Star size={12} fill="currentColor" />
                            <span className="font-bold">5.0</span>
                            <span className="text-gray-400">(Novato)</span>
                        </div>
                    </div>
                </div>
                <ShieldCheck className="text-green-500" size={20} title="Credenciado" />
            </div>

            <p className="text-gray-600 text-sm mb-6 flex-grow italic">
                "{proposal.description}"
            </p>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Honorários</span>
                    <span className="font-medium">R$ {proposal.fee_value.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxas Estatais</span>
                    <span className="font-medium">R$ {proposal.tax_value.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Total</span>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-brand-black block">R$ {proposal.total_value.toFixed(2)}</span>
                        <span className="text-xs text-green-600 font-medium">em até 12x no cartão</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Clock size={16} />
                <span>Prazo estimado: <strong className="text-gray-900">{proposal.estimated_days} dias úteis</strong></span>
            </div>

            <button
                onClick={onSelect}
                className="w-full bg-brand-yellow text-brand-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm"
            >
                Contratar Agora
            </button>
        </motion.div>
    );
};

export default ClientOrder;
