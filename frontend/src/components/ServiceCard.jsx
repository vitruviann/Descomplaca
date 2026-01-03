import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, href }) => {
    return (
        <a
            href={href}
            className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellow-300 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>

            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-black transition-colors z-10">
                <Icon size={28} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 z-10">{title}</h3>
            <p className="text-gray-500 leading-relaxed z-10">{description}</p>

            <div className="mt-auto flex items-center gap-2 text-yellow-600 font-semibold group-hover:translate-x-1 transition-transform z-10">
                <span>Saiba mais</span>
                <ArrowRight size={18} />
            </div>
        </a>
    );
};

export default ServiceCard;
