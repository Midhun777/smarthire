import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    User,
    Mail,
    FileText,
    Plus,
    Briefcase,
    Award,
    ExternalLink,
    Upload,
    Calendar,
    MapPin,
    ShieldCheck,
    Sparkles,
    Trash2,
    Edit,
    Settings as SettingsIcon,
    X,
    Camera
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ExperienceModal from '../components/ExperienceModal';
import Input from '../components/ui/Input';

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Refs for file inputs
    const resumeInputRef = useRef(null);
    const photoInputRef = useRef(null);

    // Detailed Editing State
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [editingExpIndex, setEditingExpIndex] = useState(-1);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [newSkill, setNewSkill] = useState('');

    const calculateDuration = (startDate, endDate) => {
        if (!startDate) return null;
        const start = new Date(startDate);
        const end = endDate === 'Present' ? new Date() : new Date(endDate);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setProfile(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setUploading(true);
        try {
            const { data } = await api.post('/users/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(data.message || 'Resume updated and parsed!');
            setProfile(prev => ({
                ...prev,
                resumePath: data.resumePath,
                resumeOriginalName: data.resumeOriginalName || file.name,
                skills: data.skills || prev.skills,
                experience: data.experience || prev.experience
            }));
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to upload resume';
            toast.error(message);
        } finally {
            setUploading(false);
            if (resumeInputRef.current) resumeInputRef.current.value = "";
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        try {
            const { data } = await api.post('/users/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Photo updated');
            setProfile(prev => ({
                ...prev,
                profilePicture: data.profilePicture
            }));
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload photo');
        } finally {
            setUploading(false);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    };

    // --- EXPERIENCE HANDLERS ---
    const handleAddExperience = () => {
        setEditingExp(null);
        setEditingExpIndex(-1);
        setIsExpModalOpen(true);
    };

    const handleEditExperience = (exp, index) => {
        setEditingExp(exp);
        setEditingExpIndex(index);
        setIsExpModalOpen(true);
    };

    const handleSaveExperience = async (expData) => {
        let updatedExperience = [...(profile.experience || [])];
        if (editingExpIndex > -1) {
            updatedExperience[editingExpIndex] = expData;
        } else {
            updatedExperience.unshift(expData);
        }

        try {
            const { data } = await api.put('/users/profile/experience', { experience: updatedExperience });
            setProfile({ ...profile, experience: data });
            setIsExpModalOpen(false);
            toast.success('Experience history updated');
        } catch (error) {
            toast.error('Failed to update experience');
        }
    };

    const handleDeleteExperience = async (index) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        let updatedExperience = profile.experience.filter((_, i) => i !== index);
        try {
            const { data } = await api.put('/users/profile/experience', { experience: updatedExperience });
            setProfile({ ...profile, experience: data });
            toast.success('Record deleted');
        } catch (error) {
            toast.error('Failed to delete record');
        }
    };

    // --- SKILLS HANDLERS ---
    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        if (profile.skills.includes(newSkill.trim())) {
            return toast.error('This skill already exists');
        }

        const updatedSkills = [...profile.skills, newSkill.trim()];
        try {
            const { data } = await api.put('/users/profile/skills', { skills: updatedSkills });
            setProfile({ ...profile, skills: data });
            setNewSkill('');
            toast.success('Skill added');
        } catch (error) {
            toast.error('Failed to update skills');
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        const updatedSkills = profile.skills.filter(s => s !== skillToRemove);
        try {
            const { data } = await api.put('/users/profile/skills', { skills: updatedSkills });
            setProfile({ ...profile, skills: data });
            toast.success('Skill removed');
        } catch (error) {
            toast.error('Failed to remove skill');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Loading Profile</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-10">

                {/* Left Sidebar - Personal Info */}
                <aside className="lg:w-1/3">
                    <Card className="p-0 overflow-hidden sticky top-28 border-white/40 shadow-2xl shadow-job-primary/5">
                        <div className="h-40 bg-gradient-to-br from-job-primary to-job-secondary relative">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                        </div>
                        <div className="px-8 pb-10 -mt-20 relative z-10">
                            <div className="relative mb-8 flex justify-center">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white p-3 shadow-2xl relative group/avatar">
                                    <div className="w-full h-full rounded-[2rem] bg-job-primary/5 flex items-center justify-center text-job-primary group overflow-hidden relative">
                                        {profile?.profilePicture ? (
                                            <img
                                                src={`http://localhost:5000/${profile.profilePicture}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <User size={80} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                                        )}

                                        {/* Upload Overlay */}
                                        <button
                                            onClick={() => photoInputRef.current?.click()}
                                            className="absolute inset-0 bg-job-dark/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer z-20"
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={photoInputRef}
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                disabled={uploading}
                                            />
                                            <Camera size={32} className="mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-job-dark tracking-tight leading-none mb-3">{profile?.name}</h1>
                                <div className="flex items-center justify-center space-x-2">
                                    <Badge variant="primary" className="py-1 px-4 text-xs tracking-widest uppercase">
                                        {profile?.role?.replace('_', ' ')}
                                    </Badge>
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-job-primary transition-all"
                                        title="Profile Settings"
                                    >
                                        <SettingsIcon size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-white/40">
                                <div className="flex items-center p-4 bg-white/50 rounded-2xl border border-white/60 hover:border-job-primary/20 transition-all hover:bg-white group cursor-default">
                                    <div className="w-10 h-10 bg-job-primary/10 rounded-xl flex items-center justify-center text-job-primary mr-4 group-hover:scale-110 transition-transform">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Email Address</span>
                                        <span className="text-sm font-bold text-job-dark truncate">{profile?.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-white/50 rounded-2xl border border-white/60 hover:border-job-primary/20 transition-all hover:bg-white group cursor-default">
                                    <div className="w-10 h-10 bg-job-secondary/10 rounded-xl flex items-center justify-center text-job-secondary mr-4 group-hover:scale-110 transition-transform">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Current Location</span>
                                        <span className="text-sm font-bold text-job-dark">{profile?.location || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            {profile?.bio && (
                                <div className="mt-10 pt-10 border-t border-white/40">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">About Me</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                                        "{profile.bio}"
                                    </p>
                                </div>
                            )}

                            <div className="mt-10 pt-10 border-t border-white/40">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Resume</h3>
                                {profile?.resumeOriginalName ? (
                                    <div className="flex items-center justify-between p-5 bg-white shadow-inner rounded-2xl border border-white/60 mb-6 group border-dashed border-2">
                                        <div className="flex items-center truncate">
                                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mr-4">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-600/60 leading-none mb-1 italic">Current Resume</span>
                                                <span className="text-sm font-black text-job-dark truncate pr-2">{profile.resumeOriginalName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 mb-6">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Resume Found</p>
                                    </div>
                                )}

                                <div className="block group">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={resumeInputRef}
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        disabled={uploading}
                                    />
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center py-4 bg-white hover:bg-job-primary hover:text-white border-2 border-job-primary/20 hover:border-job-primary shadow-xl shadow-job-primary/5 group-active:scale-95"
                                        loading={uploading}
                                        icon={Upload}
                                        onClick={() => resumeInputRef.current?.click()}
                                    >
                                        Update Resume
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* Right Main Content */}
                <main className="lg:w-2/3 space-y-10">

                    {/* Skills Section */}
                    <Card className="p-10 border-white/40 shadow-xl shadow-job-primary/5 overflow-hidden relative">
                        {/* Blob */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-job-primary/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-job-primary/10 rounded-2xl flex items-center justify-center text-job-primary border border-job-primary/20">
                                    <Award size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-job-dark tracking-tight">Skills</h2>
                            </div>
                            <Button
                                variant="ghost"
                                className={`p-3 ${isEditingSkills ? 'bg-job-primary text-white' : 'bg-gray-100/50'}`}
                                onClick={() => setIsEditingSkills(!isEditingSkills)}
                            >
                                {isEditingSkills ? <X size={20} /> : <Edit size={20} />}
                            </Button>
                        </div>

                        {isEditingSkills && (
                            <form onSubmit={handleAddSkill} className="mb-8 flex gap-3 animate-in slide-in-from-top-2 duration-300">
                                <Input
                                    placeholder="Enter new skill..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button type="submit" icon={Plus} className="px-8">Add Skill</Button>
                            </form>
                        )}

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {profile?.skills?.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="primary"
                                        className="px-6 py-3 text-sm font-black border-2 border-job-primary/10 hover:border-job-primary/40 hover:scale-105 transition-all cursor-default bg-white/50 backdrop-blur-sm relative group/skill"
                                    >
                                        <div className="flex items-center">
                                            {skill}
                                            {isEditingSkills && (
                                                <button
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="ml-2 p-1 hover:bg-rose-500 hover:text-white rounded-lg transition-colors bg-white/50"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            )}
                                        </div>
                                    </Badge>
                                ))
                            ) : (
                                <div className="w-full text-center py-10 bg-gray-50/50 rounded-3xl border-2 border-dashed border-indigo-100">
                                    <Sparkles className="mx-auto w-10 h-10 text-indigo-100 mb-4" />
                                    <p className="text-gray-400 font-bold">Your skill stack is empty</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Upload resume to auto-populate</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Experience Section */}
                    <Card className="p-10 border-white/40 shadow-xl shadow-job-primary/5 overflow-hidden relative">
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-job-secondary/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-job-secondary/10 rounded-2xl flex items-center justify-center text-job-secondary border border-job-secondary/20">
                                    <Briefcase size={24} />
                                </div>
                                <h2 className="text-3xl font-black text-job-dark tracking-tight">Experience</h2>
                            </div>
                            <Button variant="ghost" className="p-3 bg-gray-100/50" onClick={handleAddExperience}>
                                <Plus size={20} />
                            </Button>
                        </div>

                        <div className="space-y-12 relative z-10 px-4">
                            {profile?.experience?.length > 0 ? (
                                profile.experience.map((exp, index) => (
                                    <div key={index} className="flex gap-8 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-white/60 shadow-lg flex items-center justify-center text-gray-400 group-hover:bg-job-secondary group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-job-secondary/5 group-hover:shadow-job-secondary/20 relative z-10">
                                                <BriefcaseBusiness size={24} />
                                            </div>
                                            {index !== profile.experience.length - 1 && (
                                                <div className="w-1 h-20 bg-gradient-to-b from-gray-100 to-transparent rounded-full -mt-2 opacity-50"></div>
                                            )}
                                        </div>
                                        <div className="flex-grow pb-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-black text-job-dark tracking-tight group-hover:text-job-secondary transition-colors duration-300">
                                                        {exp.role || exp.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-3 mt-1">
                                                        <span className="text-sm font-black text-job-secondary tracking-widest uppercase">{exp.company}</span>
                                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/80 px-2 py-1 rounded-lg">
                                                            {exp.employmentType || 'Full-time'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                                        <span className="flex items-center text-xs font-bold text-gray-500 bg-white/60 border border-white/80 px-3 py-1.5 rounded-xl shadow-sm">
                                                            <Calendar size={14} className="mr-2 text-job-secondary" />
                                                            {exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}
                                                            <span className="mx-2 text-gray-300">|</span>
                                                            <span className="text-job-secondary">{calculateDuration(exp.startDate, exp.endDate)}</span>
                                                        </span>

                                                        {exp.location && (
                                                            <span className="flex items-center text-xs font-bold text-gray-500 bg-white/60 border border-white/80 px-3 py-1.5 rounded-xl shadow-sm">
                                                                <MapPin size={14} className="mr-2 text-job-secondary" />
                                                                {exp.location}
                                                            </span>
                                                        )}

                                                        {exp.industry && (
                                                            <span className="flex items-center text-xs font-bold text-gray-500 bg-white/60 border border-white/80 px-3 py-1.5 rounded-xl shadow-sm">
                                                                <Briefcase size={14} className="mr-2 text-job-secondary" />
                                                                {exp.industry}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {exp.mediaLink && (
                                                        <a
                                                            href={exp.mediaLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 hover:bg-job-primary/10 text-job-primary rounded-lg transition-colors border border-transparent hover:border-job-primary/20"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditExperience(exp, index)}
                                                        className="p-2 hover:bg-job-secondary/10 text-job-secondary rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteExperience(index)}
                                                        className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-4">
                                                {exp.description && (
                                                    <div className="relative">
                                                        <p className="text-sm text-gray-500 leading-relaxed font-medium bg-white/40 border border-white/60 p-6 rounded-[2rem] group-hover:bg-white group-hover:shadow-xl transition-all duration-500 backdrop-blur-sm shadow-sm group-hover:shadow-job-secondary/5">
                                                            {exp.description}
                                                        </p>
                                                    </div>
                                                )}

                                                {exp.skills?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 px-2">
                                                        {exp.skills.map((skill, sIdx) => (
                                                            <span key={sIdx} className="text-[10px] font-black text-job-secondary uppercase tracking-widest bg-job-secondary/5 border border-job-secondary/10 px-3 py-1 rounded-full">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-gray-200 mb-6">
                                        <Briefcase size={32} />
                                    </div>
                                    <p className="text-gray-400 font-black text-lg">No experience history yet</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Populate your history to stand out</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </main>
            </div>

            {/* Modals */}
            <ExperienceModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
                onSave={handleSaveExperience}
                experience={editingExp}
            />
        </div>
    );
};

const BriefcaseBusiness = ({ size, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default Profile;
