import React from 'react';

const Badge = ({ children, variant = 'gray', className = '', ...props }) => {
    const variants = {
        primary: 'bg-job-primary/10 text-job-primary border-job-primary/20',
        secondary: 'bg-job-secondary/10 text-job-secondary border-job-secondary/20',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        danger: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        gray: 'bg-job-dark/5 text-job-dark/60 border-job-dark/10'
    };

    return (
        <span
            className={`
        px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
