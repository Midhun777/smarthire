import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, ArrowRight, User as UserIcon, Sparkles, Briefcase, Plus, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const CompleteProfile = () => {
    const { user, completeUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const resumeInputRef = useRef(null);
    const [profileData, setProfileData] = useState({
        skills: [],
        experience: [],
        resumePath: '',
        bio: ''
    });
    const [step, setStep] = useState(1); // 1: Upload, 2: Review/Finish
    const [manualMode, setManualMode] = useState(false);
    const [skillInput, setSkillInput] = useState('');

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
            toast.success(data.message || 'Resume parsed successfully!');
            setProfileData({
                ...profileData,
                skills: data.skills || [],
                experience: data.experience || [],
                resumePath: data.resumePath
            });
            setManualMode(false);
            setStep(2);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to upload/parse resume. Please try again or skip.';
            toast.error(message);
        } finally {
            setUploading(false);
            if (resumeInputRef.current) resumeInputRef.current.value = "";
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
                setProfileData({
                    ...profileData,
                    skills: [...profileData.skills, skillInput.trim()]
                });
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(s => s !== skillToRemove)
        });
    };

    const handleFinish = async () => {
        setUploading(true);
        try {
            // If manual mode, save bio and skills first
            if (manualMode) {
                await api.put('/users/profile', { bio: profileData.bio });
                await api.put('/users/profile/skills', { skills: profileData.skills });
            }

            await api.put('/users/profile/complete');
            completeUserProfile(); // Update local context
            toast.success('Profile completed! Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to finalize profile');
        } finally {
            setUploading(false);
        }
    };

    const enterManualMode = () => {
        setManualMode(true);
        setStep(2);
    };

    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-job-primary/10 text-job-primary px-4 py-2 rounded-full mb-4 border border-job-primary/20">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Get Started</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-job-dark mb-4 tracking-tighter">Complete Your Profile</h1>
                <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
                    {manualMode
                        ? "Enter your professional details manually to get started."
                        : "Upload your resume to auto-fill your profile with skills and experience."}
                </p>
            </div>

            <Card className="p-0 border-white/40 shadow-2xl shadow-job-primary/5 overflow-hidden">
                {/* Progress Header */}
                <div className="bg-job-neutral/50 border-b border-white/40 px-10 py-6 flex justify-between items-center relative">
                    <div className="absolute top-0 left-0 h-1 bg-job-primary transition-all duration-500 ease-out" style={{ width: `${(step / 2) * 100}%` }} />

                    <div className={`flex items-center space-x-3 ${step >= 1 ? 'text-job-primary' : 'text-gray-400'} transition-colors`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${step >= 1 ? 'bg-job-primary text-white shadow-lg shadow-job-primary/20' : 'bg-gray-100'}`}>1</div>
                        <span className="font-black text-xs uppercase tracking-widest">Onboarding</span>
                    </div>

                    <div className="flex-grow mx-6 border-b-2 border-dashed border-gray-100" />

                    <div className={`flex items-center space-x-3 ${step >= 2 ? 'text-job-primary' : 'text-gray-400'} transition-colors`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${step >= 2 ? 'bg-job-primary text-white shadow-lg shadow-job-primary/20' : 'bg-gray-100'}`}>2</div>
                        <span className="font-black text-xs uppercase tracking-widest">{manualMode ? 'Details' : 'Verify'}</span>
                    </div>
                </div>

                <div className="p-10 md:p-12">
                    {step === 1 && (
                        <div className="space-y-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-center">
                                <div className="p-8 bg-job-primary/5 rounded-[2.5rem] relative group">
                                    <div className="absolute inset-0 bg-job-primary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Upload className="w-16 h-16 text-job-primary relative z-10" strokeWidth={1.5} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-job-dark mb-4 tracking-tight">Upload Your Resume</h2>
                                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                    Our AI will extract your skills and experience in seconds.
                                </p>

                                <div className="block max-w-xs mx-auto">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={resumeInputRef}
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        disabled={uploading}
                                    />
                                    <Button
                                        variant="primary"
                                        className="w-full h-16 text-lg shadow-2xl shadow-job-primary/20 hover:-translate-y-1 active:scale-95"
                                        loading={uploading}
                                        icon={Upload}
                                        onClick={() => resumeInputRef.current?.click()}
                                    >
                                        Upload PDF
                                    </Button>
                                </div>

                                <button
                                    onClick={enterManualMode}
                                    className="mt-8 text-gray-400 hover:text-job-dark text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center mx-auto space-x-2"
                                >
                                    <span>Proceed Manually</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <div className="flex items-center space-x-4 mb-10">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 border border-green-100">
                                        {manualMode ? <UserIcon size={24} /> : <CheckCircle size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-job-dark tracking-tight">
                                            {manualMode ? 'Professional Bio' : 'Parsed Details'}
                                        </h2>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                                            {manualMode ? 'Tell us about yourself' : 'Verify your details'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {manualMode && (
                                        <div>
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 block">
                                                Short Biography
                                            </label>
                                            <textarea
                                                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-job-primary focus:ring-4 focus:ring-job-primary/5 transition-all outline-none text-job-dark font-medium leading-relaxed resize-none"
                                                placeholder="Briefly describe your professional background and goals..."
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                            <Badge variant="primary" className="mr-3 h-5 w-5 p-0 flex items-center justify-center rounded-lg">1</Badge>
                                            Skills {manualMode ? '' : 'Identified'}
                                        </h3>

                                        {manualMode && (
                                            <div className="flex space-x-2 mb-6">
                                                <input
                                                    type="text"
                                                    className="flex-grow p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-job-primary outline-none transition-all font-bold text-sm"
                                                    placeholder="Add a skill (e.g. React)..."
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyDown={handleAddSkill}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    className="rounded-xl px-6"
                                                    onClick={handleAddSkill}
                                                >
                                                    <Plus size={20} />
                                                </Button>
                                            </div>
                                        )}

                                        {profileData.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills.map((skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="primary"
                                                        className="px-4 py-2 font-black border border-job-primary/10 shadow-sm flex items-center space-x-2"
                                                    >
                                                        <span>{skill}</span>
                                                        {manualMode && (
                                                            <button
                                                                onClick={() => removeSkill(skill)}
                                                                className="ml-2 hover:text-red-500 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                                <p className="text-sm text-gray-400 font-bold italic">
                                                    {manualMode ? 'No skills added yet.' : 'No skills detected. Our AI might need a clearer document.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {!manualMode && (
                                        <div>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                                <Badge variant="secondary" className="mr-3 h-5 w-5 p-0 flex items-center justify-center rounded-lg">2</Badge>
                                                Experience
                                            </h3>
                                            {profileData.experience.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {profileData.experience.slice(0, 3).map((exp, i) => (
                                                        <div key={i} className="flex items-center p-5 bg-white border border-white/60 shadow-sm rounded-2xl group hover:border-job-secondary/20 transition-all">
                                                            <div className="w-12 h-12 bg-job-secondary/10 rounded-xl flex items-center justify-center text-job-secondary mr-4 group-hover:scale-110 transition-transform">
                                                                <Briefcase size={20} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="font-black text-job-dark leading-none mb-1">{exp.role || exp.title}</p>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{exp.company}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                                    <p className="text-sm text-gray-400 font-bold italic">No work history blocks identified.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/40">
                                <Button
                                    onClick={handleFinish}
                                    variant="primary"
                                    className="w-full h-16 text-lg shadow-2xl shadow-job-primary/20 group h-16"
                                    icon={ArrowRight}
                                    loading={uploading}
                                >
                                    Finish Profile
                                </Button>
                                <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose max-w-xs mx-auto">
                                    By proceeding, you agree to our terms of data processing for AI recruitment.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CompleteProfile;
