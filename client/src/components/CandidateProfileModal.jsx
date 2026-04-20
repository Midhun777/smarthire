import React from 'react';
import {
    X, User, Mail, MapPin, Briefcase, GraduationCap,
    Award, Calendar, FileText, Sparkles, ExternalLink,
    Clock, CheckCircle2, XCircle
} from 'lucide-react';
import Badge from './ui/Badge';
import Button from './ui/Button';

const CandidateProfileModal = ({ isOpen, onClose, candidate, application, onUpdateStatus }) => {
    const [showStatusMenu, setShowStatusMenu] = React.useState(false);

    if (!isOpen || !candidate) return null;

    const calculateDuration = (startDate, endDate) => {
        if (!startDate) return null;
        const start = new Date(startDate);
        const end = endDate === 'Present' ? new Date() : new Date(endDate);
        if (isNaN(start.getTime())) return null;

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        const yearStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
        const monthStr = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';

        return [yearStr, monthStr].filter(Boolean).join(' ') || '1 mo';
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-job-dark/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300 flex flex-col">
                
                {/* Header */}
                <div className="px-8 py-6 bg-job-neutral/50 border-b border-white/40 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                            {candidate.profilePicture ? (
                                <img 
                                    src={`http://localhost:5000/${candidate.profilePicture}`} 
                                    alt={candidate.name} 
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full bg-job-primary/10 flex items-center justify-center text-job-primary font-black">
                                    {candidate.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-job-dark tracking-tighter leading-tight">{candidate.name}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center mt-1">
                                <Mail size={12} className="mr-1 text-job-primary" />
                                {candidate.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden md:flex flex-col items-end px-6 py-2 rounded-2xl border ${application?.aiMatch?.matchPercentage >= 70 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">AI Match Score</span>
                            <span className={`text-xl font-black ${application?.aiMatch?.matchPercentage >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                                {application?.aiMatch?.matchPercentage || 0}%
                            </span>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-job-dark bg-gray-50/50">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth">
                    
                    {/* Top Row: Info & Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio */}
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                                    <User size={14} className="mr-2 text-job-primary" />
                                    About Candidate
                                </h3>
                                <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-job-primary/20 pl-4 bg-gray-50/50 py-4 rounded-r-2xl">
                                    {candidate.bio || "No professional biography provided."}
                                </p>
                            </section>

                            {/* AI Insight */}
                            <section className="bg-job-neutral/30 rounded-3xl p-6 border border-white/60 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-job-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <h3 className="text-xs font-black text-job-primary uppercase tracking-[0.2em] mb-4 flex items-center">
                                    <Sparkles size={14} className="mr-2" />
                                    AI Recruiter Insight
                                </h3>
                                <p className="text-sm text-job-dark font-medium leading-relaxed relative z-10">
                                    "{application?.aiMatch?.reason || "Finalizing AI analysis... Analysis will be available shortly."}"
                                </p>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Personal Details</h3>
                                <div className="space-y-5">
                                    <div className="flex items-center text-sm font-bold text-job-dark">
                                        <div className="w-8 h-8 rounded-lg bg-job-secondary/10 flex items-center justify-center text-job-secondary mr-3 shrink-0">
                                            <MapPin size={16} />
                                        </div>
                                        {candidate.location || "Not Specified"}
                                    </div>
                                    {candidate.resumePath && (
                                        <a 
                                            href={`http://localhost:5000/${candidate.resumePath}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-between p-4 bg-job-primary/5 rounded-2xl border border-job-primary/10 hover:bg-job-primary hover:text-white transition-all group/resume"
                                        >
                                            <div className="flex items-center">
                                                <FileText size={18} className="mr-3 text-job-primary group-hover/resume:text-white" />
                                                <span className="text-xs font-black uppercase tracking-widest">Resume Document</span>
                                            </div>
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Application Status</span>
                                    <Badge variant={application?.status === 'Accepted' ? 'success' : application?.status === 'Rejected' ? 'danger' : 'primary'}>
                                        {application?.status?.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center text-xs font-bold text-gray-500">
                                    <Clock size={14} className="mr-2" />
                                    Applied {new Date(application?.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-white/40" />

                    {/* Skills */}
                    <section>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                            <Award size={16} className="mr-2 text-job-primary" />
                            Core Competencies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills?.length > 0 ? (
                                candidate.skills.map((skill, index) => (
                                    <Badge 
                                        key={index} 
                                        variant="primary" 
                                        className="px-5 py-2.5 text-xs font-black bg-white border-2 border-job-primary/10 hover:border-job-primary/30 transition-all shadow-sm"
                                    >
                                        {skill}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No skills listed.</p>
                            )}
                        </div>
                    </section>

                    {/* Experience & Education Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Experience */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center">
                                <Briefcase size={16} className="mr-2 text-job-secondary" />
                                Professional Timeline
                            </h3>
                            <div className="space-y-8 pl-4 border-l-2 border-gray-100 relative">
                                {candidate.experience?.length > 0 ? (
                                    candidate.experience.map((exp, index) => (
                                        <div key={index} className="relative group">
                                            <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-job-secondary" />
                                            <div>
                                                <h4 className="font-black text-job-dark leading-none mb-1 group-hover:text-job-secondary transition-colors">
                                                    {exp.title || exp.role}
                                                </h4>
                                                <p className="text-[10px] font-black text-job-secondary uppercase tracking-widest">{exp.company}</p>
                                                <div className="flex items-center mt-2 text-[10px] font-black text-gray-400 uppercase">
                                                    <Calendar size={12} className="mr-1" />
                                                    {exp.startDate} - {exp.endDate}
                                                    <span className="mx-2 text-gray-200">|</span>
                                                    <span className="text-job-secondary">{calculateDuration(exp.startDate, exp.endDate)}</span>
                                                </div>
                                                {exp.description && (
                                                    <p className="mt-3 text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic pl-4">No experience listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center">
                                <GraduationCap size={16} className="mr-2 text-job-accent" />
                                Academic Background
                            </h3>
                            <div className="space-y-8 pl-4 border-l-2 border-gray-100 relative">
                                {candidate.education?.length > 0 ? (
                                    candidate.education.map((edu, index) => (
                                        <div key={index} className="relative group">
                                            <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border-4 border-job-accent" />
                                            <div>
                                                <h4 className="font-black text-job-dark leading-none mb-1 group-hover:text-job-accent transition-colors">
                                                    {edu.degree}
                                                </h4>
                                                <p className="text-[10px] font-black text-job-accent uppercase tracking-widest">{edu.school}</p>
                                                <div className="flex items-center mt-2 text-[10px] font-black text-gray-400 uppercase">
                                                    <Calendar size={12} className="mr-1" />
                                                    {edu.startDate ? `${edu.startDate} - ${edu.endDate || 'Present'}` : edu.year}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic pl-4">No education listed.</p>
                                )}
                            </div>
                        </section>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Confidential AI Evaluation • Platform Analytics
                    </p>
                    <div className="flex gap-3 relative">
                        {showStatusMenu ? (
                            <div className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex flex-col gap-1 min-w-[200px] animate-in slide-in-from-bottom-2 duration-300">
                                {['Shortlisted', 'Accepted', 'Rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            onUpdateStatus(application._id, status);
                                            setShowStatusMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-job-primary/5 text-sm font-black text-job-dark hover:text-job-primary transition-colors flex items-center justify-between group"
                                    >
                                        {status}
                                        <CheckCircle2 size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    onClick={() => setShowStatusMenu(false)}
                                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : null}

                        <Button 
                            variant="primary" 
                            icon={CheckCircle2}
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                        >
                            Update Decision
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileModal;
