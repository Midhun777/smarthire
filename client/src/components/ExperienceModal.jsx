import React, { useState, useEffect } from 'react';
import { X, Briefcase, Calendar, MapPin, AlignLeft, Sparkles, Link as LinkIcon, Plus, Tag } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

const ExperienceModal = ({ isOpen, onClose, onSave, experience = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        employmentType: 'Full-time',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        skills: [],
        industry: '',
        mediaLink: ''
    });

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (experience) {
            setFormData({
                ...experience,
                isCurrent: experience.endDate === 'Present' || !experience.endDate
            });
        } else {
            setFormData({
                title: '',
                company: '',
                employmentType: 'Full-time',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: '',
                skills: [],
                industry: '',
                mediaLink: ''
            });
        }
    }, [experience, isOpen]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            endDate: formData.isCurrent ? 'Present' : formData.endDate
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-job-dark/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 bg-job-neutral/50 border-b border-white/40 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-job-secondary/10 rounded-xl flex items-center justify-center text-job-secondary border border-job-secondary/20">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-job-dark tracking-tight">{experience ? 'Edit Experience' : 'Add Experience'}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provide your work history</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Job Title"
                            icon={Briefcase}
                            placeholder="e.g. Software Engineer"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Input
                            label="Company"
                            icon={Sparkles}
                            placeholder="e.g. Google"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Employment Type</label>
                            <select
                                className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl py-3 px-4 text-sm font-semibold text-job-dark focus:ring-4 focus:ring-job-primary/10 focus:border-job-primary outline-none"
                                value={formData.employmentType}
                                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Self-employed</option>
                                <option>Freelance</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>
                        <Input
                            label="Location"
                            icon={MapPin}
                            placeholder="e.g. New York / Remote"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Industry"
                            icon={Briefcase}
                            placeholder="e.g. Tech"
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        />
                        <Input
                            label="Media / Portfolio Link"
                            icon={LinkIcon}
                            placeholder="https://..."
                            value={formData.mediaLink}
                            onChange={(e) => setFormData({ ...formData, mediaLink: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Start Date"
                            icon={Calendar}
                            type="month"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                        {!formData.isCurrent && (
                            <Input
                                label="End Date"
                                icon={Calendar}
                                type="month"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required={!formData.isCurrent}
                            />
                        )}
                    </div>

                    <div className="flex items-center space-x-3 px-1">
                        <input
                            type="checkbox"
                            id="isCurrent"
                            className="w-5 h-5 rounded-lg border-gray-300 text-job-primary focus:ring-job-primary/20 cursor-pointer"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                        />
                        <label htmlFor="isCurrent" className="text-sm font-bold text-job-dark cursor-pointer">
                            I am currently working in this role
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center">
                            <AlignLeft size={12} className="mr-1" />
                            Description
                        </label>
                        <textarea
                            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 text-sm font-semibold text-job-dark placeholder:text-gray-300 focus:ring-4 focus:ring-job-primary/10 focus:border-job-primary outline-none min-h-[120px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center">
                            <Tag size={12} className="mr-1" />
                            Skills (Used in this role)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center bg-job-primary/5 text-job-primary border border-job-primary/10 px-3 py-1.5 rounded-xl text-xs font-bold">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-rose-500">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add skill (e.g. React, Python)"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="flex-grow"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            />
                            <Button type="button" variant="ghost" className="px-4" onClick={handleAddSkill}>
                                <Plus size={18} />
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row gap-4">
                        <Button type="submit" variant="primary" className="flex-grow h-14" icon={Sparkles}>
                            {experience ? 'Update Experience' : 'Add Experience'}
                        </Button>
                        <Button type="button" variant="ghost" className="h-14 border-2 border-dashed" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExperienceModal;
