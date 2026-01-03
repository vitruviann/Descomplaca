import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ChatHeader() {
    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-white/20 px-4 py-3 flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-1 select-none">
                <span className="font-hand text-2xl text-brand-yellow drop-shadow-sm">DES</span>
                <span className="font-hand text-2xl text-brand-black drop-shadow-sm">COM</span>
                <span className="font-hand text-2xl text-brand-yellow drop-shadow-sm">PLAC</span>
                <span className="font-hand text-2xl text-brand-green drop-shadow-sm">A</span>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-white/40 shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span className="text-xs font-semibold text-brand-green font-sans tracking-wide">
                    SITE SEGURO
                </span>
            </div>
        </header>
    );
}
