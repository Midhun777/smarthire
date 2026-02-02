import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-job-primary transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl py-3 
                        ${Icon ? 'pl-11' : 'px-4'} pr-4
                        text-sm font-semibold text-job-dark placeholder:text-gray-300
                        focus:ring-4 focus:ring-job-primary/10 focus:border-job-primary 
                        hover:border-white transition-all outline-none
                        ${error ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest px-1">{error}</p>}
        </div>
    );
};

export default Input;
