import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, Briefcase, Building2, MapPin, DollarSign, ListChecks, FileText, Send } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const JobFormModal = ({ isOpen, onClose, onSuccess, job }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || '',
                company: job.company || '',
                location: job.location || '',
                type: job.type || 'Full-time',
                salary: job.salary || '',
                description: job.description || '',
                requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements || ''
            });
        } else {
            setFormData({
                title: '',
                company: '',
                location: '',
                type: 'Full-time',
                salary: '',
                description: '',
                requirements: ''
            });
        }
    }, [job, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.split(',').map(s => s.trim()).filter(s => s !== '')
            };

            if (job) {
                await api.put(`/jobs/${job._id}`, payload);
                toast.success('Mission parameters updated');
            } else {
                await api.post('/jobs', payload);
                toast.success('New mission deployed successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Protocol failure during deployment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-job-dark/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-white/60 shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/40 bg-job-neutral/50 flex justify-between items-center shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-job-primary/10 rounded-xl flex items-center justify-center text-job-primary shadow-inner">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-job-dark tracking-tighter">{job ? 'Modify Mission' : 'Deploy New Mission'}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration Interface</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Mission Title"
                            placeholder="e.g. Senior Neural Architect"
                            icon={Briefcase}
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Input
                            label="Parent Entity (Company)"
                            placeholder="e.g. Cyberdyne Systems"
                            icon={Building2}
                            required
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Input
                            label="Geographic Node"
                            placeholder="e.g. Kochi, Kerala"
                            icon={MapPin}
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Engagement Type</label>
                            <select
                                className="w-full h-12 bg-white/50 border border-white/60 rounded-2xl px-4 text-sm font-black text-job-dark focus:ring-2 focus:ring-job-primary/20 focus:border-job-primary transition-all outline-none appearance-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                                <option>Internship</option>
                            </select>
                        </div>
                        <Input
                            label="Salary Projection"
                            placeholder="e.g. ₹12L - ₹18L"
                            icon={DollarSign}
                            value={formData.salary}
                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Skill Matrix (Comma separated)"
                        placeholder="React, Node.js, AI Ethics"
                        icon={ListChecks}
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        className="font-mono text-xs"
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mission Intelligence (Description)</label>
                        <textarea
                            required
                            rows={5}
                            placeholder="Define the scope of this mission..."
                            className="w-full bg-white/50 border border-white/60 rounded-2xl p-4 text-sm font-medium text-job-dark focus:ring-2 focus:ring-job-primary/20 focus:border-job-primary transition-all outline-none resize-none placeholder:text-gray-300"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="px-8 font-black uppercase tracking-widest text-[10px] h-14"
                        >
                            Abort
                        </Button>
                        <Button
                            type="submit"
                            className="px-10 font-black uppercase tracking-widest text-[10px] h-14 shadow-xl shadow-job-primary/20"
                            loading={isSubmitting}
                            icon={Send}
                        >
                            {job ? 'Apply Parameters' : 'Deploy Mission'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default JobFormModal;

