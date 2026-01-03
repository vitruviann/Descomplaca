import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, UserCheck, CheckCircle, Smartphone } from 'lucide-react';

const Layout = () => {
    const location = useLocation();

    const steps = [
        { path: '/', icon: ShieldCheck, label: 'Consentimento' },
        { path: '/triage', icon: FileText, label: 'Serviço' },
        { path: '/auth', icon: UserCheck, label: 'Autenticação' },
        { path: '/result', icon: CheckCircle, label: 'Conclusão' },
    ];

    const currentStepIndex = steps.findIndex(step =>
        location.pathname === step.path ||
        (step.path === '/triage' && location.pathname === '/upload') ||
        (step.path === '/auth' && location.pathname === '/progress')
    );

    return (
        <div className="flex h-screen bg-gray-50 flex-col">
            <header className="bg-blue-900 text-white p-4 shadow-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold tracking-tight">Despachante Digital</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/pipeline" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1 rounded transition-colors flex items-center gap-2">
                        <Smartphone size={16} /> Dashboard
                    </Link>
                    <div className="text-sm opacity-80">Posto de Atendimento - Vila Velha</div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
                    {/* Progress Stepper */}
                    <div className="bg-gray-100 p-4 border-b flex justify-between px-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index <= (currentStepIndex === -1 ? 0 : currentStepIndex);
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.path} className={`flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${isActive ? 'bg-blue-100' : 'bg-gray-200'} ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-xs font-semibold">{step.label}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex-1 p-8">
                        <Outlet />
                    </div>
                </div>
            </main>

            <footer className="p-4 text-center text-gray-400 text-xs">
                Ambiente Seguro • Dados processados conforme LGPD • Destruição automática de sessão
            </footer>
        </div>
    );
};

export default Layout;
