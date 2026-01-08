import React from 'react';
import { Menu, Bell } from 'lucide-react';

const DashboardHeader = ({ userName = "JOAO" }) => {
    return (
        <header className="bg-[#0b1e47] text-white p-4 fixed top-0 w-full z-10 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <Menu size={28} />
                </button>

                <h1 className="text-xl font-medium tracking-wide">{userName}</h1>

                <div className="flex items-center gap-4">
                    <button className="relative p-1 hover:bg-white/10 rounded-full transition-colors">
                        <Bell size={24} />
                        {/* Optional unread badge */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b1e47]"></span>
                    </button>

                    <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 font-medium text-sm">
                        {userName.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
