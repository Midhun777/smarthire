import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, ArrowRight, User as UserIcon, Sparkles, Briefcase } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const CompleteProfile = () => {
    const { user, completeUserProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [profileData, setProfileData] = useState({
        skills: [],
        experience: [],
        resumePath: ''
    });
    const [step, setStep] = useState(1); // 1: Upload, 2: Review/Finish

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
            toast.success('Resume parsed successfully!');
            setProfileData({
                skills: data.skills || [],
                experience: data.experience || [],
                resumePath: data.resumePath
            });
            setStep(2);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload/parse resume. Please try again or skip.');
        } finally {
            setUploading(false);
        }
    };

    const handleFinish = async () => {
        try {
            await api.put('/users/profile/complete');
            completeUserProfile(); // Update local context
            toast.success('Profile completed! Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to finalize profile');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-job-primary/10 text-job-primary px-4 py-2 rounded-full mb-4 border border-job-primary/20">
                    <Sparkles size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Onboarding Experience</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-job-dark mb-4 tracking-tighter">Scale Your Career</h1>
                <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
                    Initialize your profile with AI to unlock personalized job opportunities and smart match scoring.
                </p>
            </div>

            <Card className="p-0 border-white/40 shadow-2xl shadow-job-primary/5 overflow-hidden">
                {/* Progress Header */}
                <div className="bg-job-neutral/50 border-b border-white/40 px-10 py-6 flex justify-between items-center relative">
                    <div className="absolute top-0 left-0 h-1 bg-job-primary transition-all duration-500 ease-out" style={{ width: `${(step / 2) * 100}%` }} />

                    <div className={`flex items-center space-x-3 ${step >= 1 ? 'text-job-primary' : 'text-gray-400'} transition-colors`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${step >= 1 ? 'bg-job-primary text-white shadow-lg shadow-job-primary/20' : 'bg-gray-100'}`}>1</div>
                        <span className="font-black text-xs uppercase tracking-widest">Ignition</span>
                    </div>

                    <div className="flex-grow mx-6 border-b-2 border-dashed border-gray-100" />

                    <div className={`flex items-center space-x-3 ${step >= 2 ? 'text-job-primary' : 'text-gray-400'} transition-colors`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${step >= 2 ? 'bg-job-primary text-white shadow-lg shadow-job-primary/20' : 'bg-gray-100'}`}>2</div>
                        <span className="font-black text-xs uppercase tracking-widest">Validation</span>
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
                                <h2 className="text-3xl font-black text-job-dark mb-4 tracking-tight">Deploy Your Resume</h2>
                                <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                                    Our neural engine will extract your expertise and professional history in seconds.
                                </p>

                                <label className="block max-w-xs mx-auto">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        disabled={uploading}
                                    />
                                    <Button
                                        variant="primary"
                                        className="w-full h-16 text-lg shadow-2xl shadow-job-primary/20 hover:-translate-y-1 active:scale-95"
                                        loading={uploading}
                                        icon={Upload}
                                    >
                                        Upload PDF Artifact
                                    </Button>
                                </label>

                                <button
                                    onClick={() => setStep(2)}
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
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-job-dark tracking-tight">Intelligence Report</h2>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Verify Extracted Metadata</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                            <Badge variant="primary" className="mr-3 h-5 w-5 p-0 flex items-center justify-center rounded-lg">1</Badge>
                                            Skills Identified
                                        </h3>
                                        {profileData.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills.map((skill, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="primary"
                                                        className="px-4 py-2 font-black border border-job-primary/10 shadow-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                                <p className="text-sm text-gray-400 font-bold italic">No skills detected. Our AI might need a clearer document.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                            <Badge variant="secondary" className="mr-3 h-5 w-5 p-0 flex items-center justify-center rounded-lg">2</Badge>
                                            Experience Blocks
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
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/40">
                                <Button
                                    onClick={handleFinish}
                                    variant="primary"
                                    className="w-full h-16 text-lg shadow-2xl shadow-job-primary/20 group h-16"
                                    icon={ArrowRight}
                                >
                                    Finalize Onboarding
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

