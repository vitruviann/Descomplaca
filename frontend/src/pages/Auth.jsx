
import React, { useState } from 'react';
import { auth } from '../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
            }
            navigate('/solicitar'); // Redirect after auth
        } catch (err) {
            console.error(err);
            let msg = "Erro na autenticação.";
            if (err.code === 'auth/wrong-password') msg = "Senha incorreta.";
            if (err.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
            if (err.code === 'auth/email-already-in-use') msg = "E-mail já cadastrado.";
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-bg flex items-center justify-center p-4">
            <SEO title={isLogin ? "Entrar" : "Criar Conta"} description="Acesse sua conta no Despachante Digital." />
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h2>
                    <p className="text-gray-500">
                        {isLogin ? 'Acesse sua conta para continuar' : 'Preencha seus dados para começar'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Nome Completo"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Senha"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-yellow text-brand-black font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
                    >
                        {isLogin ? 'Entrar' : 'Cadastrar'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-500 hover:text-brand-black text-sm font-medium"
                    >
                        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
