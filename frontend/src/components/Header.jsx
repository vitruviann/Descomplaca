import React, { useState, useEffect } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Serviços', href: '#servicos' },
        { name: 'Como Funciona', href: '#como-funciona' },
        { name: 'Sobre Nós', href: '#sobre' },
        { name: 'Depoimentos', href: '#depoimentos' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                    <div className="bg-yellow-400 p-2 rounded-lg">
                        <Car size={24} className="text-black" />
                    </div>
                    <span className="text-gray-900">Despachante<span className="text-yellow-500">Digital</span></span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-600 hover:text-yellow-500 font-medium transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <Link to="/solicitar" className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-yellow-400 hover:text-black transition-all transform hover:scale-105">
                        Solicitar Serviço
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-900"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 md:hidden flex flex-col gap-4 border-t border-gray-100">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-gray-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link to="/solicitar" className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold text-center block" onClick={() => setIsMenuOpen(false)}>
                            Solicitar Agora
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
