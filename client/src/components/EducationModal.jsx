import React, { useState, useEffect } from 'react';
import { X, GraduationCap as GraduationIcon, Calendar, MapPin, AlignLeft, Sparkles, BookOpen } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

const EducationModal = ({ isOpen, onClose, onSave, education = null }) => {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldOfStudy: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
    });

    useEffect(() => {
        if (education) {
            setFormData({
                ...education,
                isCurrent: education.endDate === 'Present' || !education.endDate
            });
        } else {
            setFormData({
                school: '',
                degree: '',
                fieldOfStudy: '',
                location: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                description: ''
            });
        }
    }, [education, isOpen]);

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
                        <div className="w-10 h-10 bg-job-accent/10 rounded-xl flex items-center justify-center text-job-accent border border-job-accent/20">
                            <GraduationIcon size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-job-dark tracking-tight">{education ? 'Edit Education' : 'Add Education'}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic background details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="School / University"
                            icon={BookOpen}
                            placeholder="e.g. Stanford University"
                            value={formData.school}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                            required
                        />
                        <Input
                            label="Degree"
                            icon={GraduationIcon}
                            placeholder="e.g. Bachelor's Degree"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Field of Study"
                            icon={Sparkles}
                            placeholder="e.g. Computer Science"
                            value={formData.fieldOfStudy}
                            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                        />
                        <Input
                            label="Location"
                            icon={MapPin}
                            placeholder="e.g. California, US"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                                label="End Date (or expected)"
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
                            id="isCurrentEdu"
                            className="w-5 h-5 rounded-lg border-gray-300 text-job-accent focus:ring-job-accent/20 cursor-pointer"
                            checked={formData.isCurrent}
                            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                        />
                        <label htmlFor="isCurrentEdu" className="text-sm font-bold text-job-dark cursor-pointer">
                            I am currently studying here
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center">
                            <AlignLeft size={12} className="mr-1" />
                            Additional Details
                        </label>
                        <textarea
                            className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 text-sm font-semibold text-job-dark placeholder:text-gray-300 focus:ring-4 focus:ring-job-accent/10 focus:border-job-accent outline-none min-h-[120px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Courses, honors, or activities..."
                        />
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row gap-4">
                        <Button type="submit" variant="primary" className="flex-grow h-14 bg-job-accent hover:bg-job-accent/90" icon={Sparkles}>
                            {education ? 'Update Education' : 'Add Education'}
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

export default EducationModal;
