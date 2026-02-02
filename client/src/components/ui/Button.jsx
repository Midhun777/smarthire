import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    icon: Icon,
    ...props
}) => {
    const baseStyles = "flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 px-6 py-3";

    const variants = {
        primary: 'bg-job-primary text-white hover:bg-job-primary/90 shadow-lg shadow-job-primary/25',
        secondary: 'bg-job-secondary text-white hover:bg-job-secondary/90 shadow-lg shadow-job-secondary/25',
        ghost: 'bg-transparent text-job-primary hover:bg-job-primary/5',
        outline: 'bg-transparent border-2 border-job-primary text-job-primary hover:bg-job-primary/5'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : Icon && (
                <Icon className="w-5 h-5 mr-2" />
            )}
            {children}
        </button>
    );
};

export default Button;
