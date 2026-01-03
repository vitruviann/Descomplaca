import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, CheckCircle, Camera, CreditCard, Box } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const PipelineDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchPipeline = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/pipeline/data');
            const data = await res.json();
            if (data.data) {
                setOrders(data.data);
                setLastUpdated(data.last_updated);
            }
        } catch (error) {
            console.error("Failed to fetch pipeline data", error);
        }
    };

    const triggerRefresh = async () => {
        setLoading(true);
        try {
            await fetch('http://127.0.0.1:8000/pipeline/refresh', { method: 'POST' });
            await fetchPipeline();
        } catch (error) {
            console.error("Failed to refresh", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPipeline();
        const interval = setInterval(fetchPipeline, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Categorize Orders
    const columns = {
        financial: orders.filter(o => !o.flag_pago),
        docs: orders.filter(o => o.flag_pago && !o.flag_foto && !o.situacao.includes("Fabricada") && !o.situacao.includes("Finalizada")),
        production: orders.filter(o => o.flag_pago && o.flag_foto && !o.situacao.includes("Fabricada") && !o.situacao.includes("Finalizada")),
        completed: orders.filter(o => o.situacao.includes("Fabricada") || o.situacao.includes("Finalizada"))
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pipeline de Produção</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Atualizado em: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Nunca'}
                    </p>
                </div>
                <button
                    onClick={triggerRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    {loading ? "Atualizando..." : "Sincronizar"}
                </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-150px)] overflow-hidden">

                <KanbanColumn
                    title="Pendência Financeira"
                    color="border-l-4 border-red-500"
                    bg="bg-red-50"
                    icon={<CreditCard className="w-5 h-5 text-red-500" />}
                    items={columns.financial}
                />

                <KanbanColumn
                    title="Pendência Fotos"
                    color="border-l-4 border-orange-500"
                    bg="bg-orange-50"
                    icon={<Camera className="w-5 h-5 text-orange-500" />}
                    items={columns.docs}
                />

                <KanbanColumn
                    title="Em Produção"
                    color="border-l-4 border-blue-500"
                    bg="bg-blue-50"
                    icon={<Box className="w-5 h-5 text-blue-500" />}
                    items={columns.production}
                />

                <KanbanColumn
                    title="Expedição / Concluído"
                    color="border-l-4 border-green-500"
                    bg="bg-green-50"
                    icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                    items={columns.completed}
                />

            </div>
        </div>
    );
};

const KanbanColumn = ({ title, items, color, bg, icon }) => {
    return (
        <div className={cn("flex flex-col h-full rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden")}>
            <div className={cn("p-4 border-b flex items-center gap-3", bg)}>
                {icon}
                <h2 className="font-semibold text-gray-700">{title}</h2>
                <span className="ml-auto bg-white/50 px-2 py-0.5 rounded text-sm font-medium">
                    {items.length}
                </span>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Nenhum pedido</div>
                ) : (
                    items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("p-4 bg-white rounded-lg border shadow-sm group hover:shadow-md transition-all cursor-pointer relative", color)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg">{item.placa}</h3>
                                {/* SLA Indicator Mock */}
                                <div className="w-2 h-2 rounded-full bg-green-500" title="No Prazo"></div>
                            </div>

                            <p className="text-gray-600 text-sm font-medium mb-1 truncate">{item.proprietario}</p>

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                <span>ID: {item.id}</span>
                                <span className="ml-auto">{item.situacao}</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PipelineDashboard;
