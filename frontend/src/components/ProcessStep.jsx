import React from 'react';

const ProcessStep = ({ number, title, description }) => {
    return (
        <div className="flex flex-col items-center text-center gap-4 relative md:w-1/3">
            <div className="w-16 h-16 rounded-full bg-black text-yellow-400 text-2xl font-bold flex items-center justify-center shadow-lg relative z-10">
                {number}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 max-w-xs mx-auto">{description}</p>
        </div>
    );
};

export default ProcessStep;
