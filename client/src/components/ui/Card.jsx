import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
    return (
        <div className={`
            bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-xl shadow-job-primary/5
            ${hover ? 'hover:shadow-2xl hover:shadow-job-primary/10 transition-all duration-300 hover:-translate-y-1' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
