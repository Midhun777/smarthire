import React from 'react';
import Card from './ui/Card';

const StatCard = ({ icon: Icon, label, value, variant = 'primary' }) => {
    const variants = {
        primary: "bg-job-primary/10 text-job-primary border-job-primary/20",
        secondary: "bg-job-secondary/10 text-job-secondary border-job-secondary/20",
        accent: "bg-job-accent/10 text-job-accent border-job-accent/20"
    };

    return (
        <Card className="flex items-center space-x-5 p-6 border-white/40">
            <div className={`p-4 rounded-2xl ${variants[variant]} flex items-center justify-center shadow-inner`}>
                <Icon size={28} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-job-dark tracking-tight">{value}</p>
            </div>
        </Card>
    );
};

export default StatCard;

