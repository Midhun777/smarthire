import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    Briefcase,
    MapPin,
    Clock,
    IndianRupee,
    ChevronLeft,
    CheckCircle,
    Sparkles,
    AlertCircle,
    Calendar,
    Target,
    Zap,
    ArrowRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [matching, setMatching] = useState(false);

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            try {
                const [jobRes, appsRes] = await Promise.all([
                    api.get(`/jobs/${id}`),
                    api.get('/applications/my')
                ]);
                setJob(jobRes.data);

                const applied = appsRes.data.some(app => app.job?._id === id);
                setIsApplied(applied);

                if (user) {
                    setMatching(true);
                    try {
                        const matchRes = await api.get(`/jobs/${id}/match`);
                        setMatchData(matchRes.data);
                    } catch (err) {
                        console.log("Match check skipped or failed:", err.response?.data?.message);
                    } finally {
                        setMatching(false);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJobAndStatus();
    }, [id, user]);

    const handleApply = async () => {
        setApplying(true);
        try {
            await api.post('/applications', { jobId: id });
            setIsApplied(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Analyzing Metadata</p>
        </div>
    );
    if (!job) return <div className="text-center py-20 font-black text-gray-400">Job not found</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20 px-4">
            <Link
                to="/dashboard"
                className="inline-flex items-center text-gray-400 hover:text-job-primary mb-10 font-black uppercase tracking-widest text-xs transition-all group"
            >
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                Return to Dashboard
            </Link>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Main Content */}
                <div className="flex-grow space-y-10">
                    <Card className="p-10 border-white/40 shadow-2xl shadow-job-primary/5 overflow-hidden relative">
                        {/* Decorative Layer */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-job-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                                <div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Badge variant="primary" className="py-1 px-4 text-[10px] tracking-[0.2em] font-black">{job.type}</Badge>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="text-xs font-bold text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-job-dark tracking-tighter mb-4">{job.title}</h1>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center text-job-primary font-black uppercase tracking-widest text-xs">
                                            <div className="w-8 h-8 bg-job-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                <Briefcase size={14} />
                                            </div>
                                            {job.company}
                                        </div>
                                        <div className="flex items-center text-gray-400 font-black uppercase tracking-widest text-xs">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                <MapPin size={14} />
                                            </div>
                                            {job.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-job-neutral rounded-3xl border border-white">
                                <DetailItem label="Salary Range" value={job.salaryRange || 'NDA'} icon={IndianRupee} color="text-green-600" />
                                <DetailItem label="Exp. Level" value={job.experienceLevel} icon={Target} color="text-job-primary" />
                                <DetailItem label="Employment" value={job.type} icon={Clock} color="text-job-secondary" />
                                <DetailItem label="Role Class" value="Tier 1" icon={Zap} color="text-amber-500" />
                            </div>
                        </div>
                    </Card>

                    <section className="space-y-10">
                        <div className="px-4">
                            <h3 className="text-2xl font-black text-job-dark tracking-tight mb-6 flex items-center">
                                <div className="w-10 h-10 bg-job-dark/5 rounded-2xl flex items-center justify-center mr-4">
                                    <FileTextIcon size={20} />
                                </div>
                                Mission Description
                            </h3>
                            <div className="bg-white/40 backdrop-blur-sm border border-white/60 p-8 rounded-[2rem] shadow-sm">
                                <p className="text-gray-500 font-medium leading-[2] whitespace-pre-line text-lg">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        <div className="px-4">
                            <h3 className="text-2xl font-black text-job-dark tracking-tight mb-6 flex items-center">
                                <div className="w-10 h-10 bg-job-dark/5 rounded-2xl flex items-center justify-center mr-4">
                                    <Target size={20} />
                                </div>
                                Core Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.requirements && job.requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center p-5 bg-white border border-white/60 shadow-sm rounded-2xl group hover:border-job-primary/20 transition-all">
                                        <div className="w-10 h-10 bg-job-primary/5 rounded-xl flex items-center justify-center text-job-primary mr-4 group-hover:scale-110 transition-transform">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500 leading-tight">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sticky Sidebar */}
                <aside className="lg:w-80 shrink-0">
                    <div className="sticky top-28 space-y-6">
                        {/* Application Action Card */}
                        <Card className="p-8 border-white shadow-2xl shadow-job-primary/5">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Action Hub</h3>
                            {isApplied ? (
                                <div className="space-y-4">
                                    <div className="bg-green-500 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                                        <CheckCircle size={24} className="mr-3" />
                                        <span className="font-black uppercase tracking-widest text-sm">Application Sent</span>
                                    </div>
                                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Applied on {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    onClick={handleApply}
                                    loading={applying}
                                    className="w-full h-16 shadow-2xl shadow-job-primary/20 group text-lg"
                                    icon={ArrowRight}
                                >
                                    Apply Now
                                </Button>
                            )}
                            <p className="text-[10px] text-center mt-6 text-gray-400 font-bold uppercase tracking-widest leading-loose">
                                By applying, your profile artifact will be shared with the recruiting team.
                            </p>
                        </Card>

                        {/* AI Insight Card */}
                        {user && (
                            <Card className="p-8 border-white shadow-2xl shadow-amber-500/5 bg-amber-50/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mt-12" />

                                <div className="flex items-center space-x-3 mb-8 relative z-10">
                                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 className="text-sm font-black text-job-dark uppercase tracking-widest">AI Scoring</h3>
                                </div>

                                {matching ? (
                                    <div className="flex flex-col items-center py-6 space-y-4">
                                        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] animate-pulse">Running Neural Match</span>
                                    </div>
                                ) : matchData ? (
                                    <div className="space-y-8 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="w-20 h-20 relative">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="40" cy="40" r="36" stroke="#fef3c7" strokeWidth="8" fill="transparent" />
                                                    <circle
                                                        cx="40" cy="40" r="36" stroke="#f59e0b" strokeWidth="8" fill="transparent"
                                                        strokeDasharray={226}
                                                        strokeDashoffset={226 - (226 * matchData.matchPercentage) / 100}
                                                        strokeLinecap="round"
                                                        className="transition-all duration-1000 ease-out"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-black text-job-dark tracking-tighter">{matchData.matchPercentage}%</span>
                                                </div>
                                            </div>
                                            <div className="flex-grow ml-6">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 leading-tight mb-2">Confidence Level</p>
                                                <Badge variant="success" className="bg-amber-500 text-white border-0 shadow-lg shadow-amber-200">
                                                    High Match Potential
                                                </Badge>
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold text-gray-500 leading-relaxed bg-white/60 p-5 rounded-2xl border border-white">
                                            {matchData.reason}
                                        </p>

                                        {matchData.missingSkills && matchData.missingSkills.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gap Detection</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchData.missingSkills.map((skill, idx) => (
                                                        <Badge key={idx} variant="gray" className="text-[10px] py-1 border-gray-200">
                                                            +{skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 group cursor-pointer" onClick={() => window.location.href = '/profile'}>
                                        <AlertCircle className="mx-auto w-10 h-10 text-amber-200 mb-4 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
                                            Resume Artifact Required <br />
                                            <span className="text-amber-500 underline decoration-2 underline-offset-4">Click to Upload</span>
                                        </p>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon, color }) => (
    <div className="flex flex-col p-2">
        <div className="flex items-center space-x-2 mb-2">
            <Icon size={14} className={`${color}`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-black text-dark truncate">{value}</p>
    </div>
);

const FileTextIcon = ({ size, ...props }) => (
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
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

export default JobDetails;

