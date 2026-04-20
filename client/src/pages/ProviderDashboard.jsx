import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import {
    Plus, Briefcase, Users, Search,
    Filter, ExternalLink, Edit3, Trash2,
    CheckCircle2, XCircle, Clock, ChevronRight,
    Sparkles, MessageSquare
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';
import JobFormModal from '../components/JobFormModal';
import CandidateProfileModal from '../components/CandidateProfileModal';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [activeTab, setActiveTab] = useState('listings');
    const [appSearch, setAppSearch] = useState('');
    const [sortBy, setSortBy] = useState('match'); // 'match', 'date', 'skills', 'education', 'experience'
    const [selectedApp, setSelectedApp] = useState(null);

    // Advanced Filtering & Analytics State
    const [analytics, setAnalytics] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [minScore, setMinScore] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, appsRes, analyticsRes] = await Promise.all([
                api.get('/jobs/provider'),
                api.get('/applications/provider'),
                api.get('/jobs/provider/analytics')
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            setAnalytics(analyticsRes.data);
            setFilteredApps(appsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Filter and Sort applicants
    useEffect(() => {
        let filtered = applications.filter(app => {
            const matchesSearch = app.user?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
                                app.job?.title?.toLowerCase().includes(appSearch.toLowerCase());
            const matchesJob = selectedJobId === 'all' || app.job?._id === selectedJobId;
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            const matchesScore = (app.aiMatch?.matchPercentage || 0) >= minScore;

            return matchesSearch && matchesJob && matchesStatus && matchesScore;
        });

        // Sorting Logic
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'match') return (b.aiMatch?.matchPercentage || 0) - (a.aiMatch?.matchPercentage || 0);
            if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'skills') return (b.skillMatchCount || 0) - (a.skillMatchCount || 0);
            if (sortBy === 'education') return (b.educationRank || 0) - (a.educationRank || 0);
            if (sortBy === 'experience') return (b.experienceCount || 0) - (a.experienceCount || 0);
            return 0;
        });

        setFilteredApps(filtered);
    }, [appSearch, applications, sortBy, selectedJobId, statusFilter, minScore]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}`, { status: newStatus });
            toast.success(`Applicant status updated to ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            toast.success('Job listing removed');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete job');
        }
    };

    const handleToggleStatus = async (jobId) => {
        try {
            await api.patch(`/jobs/${jobId}/status`);
            toast.success('Listing status updated');
            fetchData();
        } catch (error) {
            toast.error('Failed to toggle status');
        }
    };

    const handleStartChat = async (app) => {
        try {
            const { data } = await api.post('/chat/conversations', {
                jobId: app.job?._id,
                seekerId: app.user?._id
            });
            navigate(`/chat?conv=${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not open chat');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Accessing Portal</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-job-dark tracking-tighter mb-2">Provider Portal</h1>
                    <p className="text-gray-500 font-medium">Manage your active jobs and candidate applications.</p>
                </div>
                <Button
                    onClick={() => { setEditingJob(null); setIsJobModalOpen(true); }}
                    icon={Plus}
                    className="shadow-xl shadow-job-primary/20"
                >
                    Post New Job
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Briefcase}
                    label="Active Jobs"
                    value={analytics?.activeJobs || 0}
                    variant="primary"
                />
                <StatCard
                    icon={Users}
                    label="Total Candidates"
                    value={analytics?.totalApplications || 0}
                    variant="secondary"
                />
                <StatCard
                    icon={Sparkles}
                    label="Shortlisted"
                    value={analytics?.shortlisted || 0}
                    variant="accent"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Hires Secured"
                    value={analytics?.hiresSecured || 0}
                    variant="success"
                />
            </div>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${activeTab === 'listings' ? 'bg-white text-job-primary shadow-sm' : 'text-gray-400 hover:text-job-dark'}`}
                    >
                        My Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('applicants')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black tracking-tight transition-all ${activeTab === 'applicants' ? 'bg-white text-job-secondary shadow-sm' : 'text-gray-400 hover:text-job-dark'}`}
                    >
                        Candidates
                    </button>
                </div>

                {activeTab === 'applicants' && (
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Find candidates..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-job-secondary/20 focus:border-job-secondary transition-all outline-none text-sm font-medium shadow-sm"
                                value={appSearch}
                                onChange={(e) => setAppSearch(e.target.value)}
                            />
                        </div>

                        {/* Job Filter */}
                        <div className="relative w-full md:w-56 group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-job-secondary" />
                            <select
                                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-job-secondary/5 focus:border-job-secondary transition-all outline-none text-xs font-black appearance-none cursor-pointer shadow-sm capitalize"
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                            >
                                <option value="all">ALL JOBS</option>
                                {jobs.map(job => (
                                    <option key={job._id} value={job._id}>{job.title.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                            {['all', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${statusFilter === status ? 'bg-white text-job-dark shadow-sm' : 'text-gray-400 hover:text-job-dark'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="relative w-full md:w-48 group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-job-secondary" />
                            <select
                                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-job-secondary/5 focus:border-job-secondary transition-all outline-none text-xs font-black appearance-none cursor-pointer shadow-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="match">MATCH</option>
                                <option value="skills">SKILLS</option>
                                <option value="education">EDU</option>
                                <option value="experience">EXP</option>
                                <option value="date">DATE</option>
                            </select>
                        </div>

                        {/* Minimum Score */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Min Score: {minScore}%</span>
                            <input 
                                type="range" 
                                min="0" 
                                max="90" 
                                step="10"
                                value={minScore}
                                onChange={(e) => setMinScore(parseInt(e.target.value))}
                                className="w-24 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-job-primary"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* List View */}
            {activeTab === 'listings' ? (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.length === 0 ? (
                        <Card className="text-center py-20 bg-gray-50/50 border-dashed border-2">
                            <Briefcase className="mx-auto w-12 h-12 mb-4 opacity-10" />
                            <p className="font-bold text-gray-400">No active jobs posted yet.</p>
                        </Card>
                    ) : (
                        jobs.map(job => (
                            <Card key={job._id} className="p-6 hover:shadow-xl transition-shadow border-white/40">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-14 h-14 bg-job-primary/5 rounded-2xl flex items-center justify-center border border-job-primary/10">
                                            <Briefcase className="text-job-primary w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-job-dark tracking-tight">{job.title}</h3>
                                            <p className="text-gray-500 font-medium text-sm flex items-center mt-1">
                                                {job.company} • {job.location}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="bg-job-neutral/50 text-job-dark text-[10px] font-black px-3 py-1 rounded-full border border-white/60">
                                                    {job.type}
                                                </span>
                                                <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full border border-amber-100">
                                                    {applications.filter(a => a.job?._id === job._id).length} APPLICANTS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center space-x-3 self-end md:self-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${job.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                            {job.status || 'active'}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={job.status === 'closed' ? CheckCircle2 : XCircle}
                                                className={job.status === 'closed' ? 'text-green-600' : 'text-amber-600'}
                                                onClick={() => handleToggleStatus(job._id)}
                                            >
                                                {job.status === 'closed' ? 'Reopen' : 'Close'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Edit3}
                                                onClick={() => { setEditingJob(job); setIsJobModalOpen(true); }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={Trash2}
                                                className="text-red-500 hover:bg-red-50"
                                                onClick={() => handleDeleteJob(job._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApps.length === 0 ? (
                        <Card className="text-center py-20 bg-gray-50/50 border-dashed border-2">
                            <Users className="mx-auto w-12 h-12 mb-4 opacity-10" />
                            <p className="font-bold text-gray-400">Waiting for candidates to apply.</p>
                        </Card>
                    ) : (
                        <div className="overflow-hidden bg-white/50 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 border-b border-white/40">
                                        <tr>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Candidate</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Target Role</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">AI Match</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20">
                                        {filteredApps.map(app => (
                                            <React.Fragment key={app._id}>
                                                <tr className="hover:bg-white/40 transition-colors border-none group">
                                                    <td className="px-6 py-4">
                                                        <div 
                                                            className="flex items-center space-x-3 cursor-pointer group/candidate"
                                                            onClick={() => setSelectedApp(app)}
                                                        >
                                                            <div className="w-10 h-10 bg-job-secondary/10 rounded-xl flex items-center justify-center text-job-secondary font-black text-xs group-hover/candidate:bg-job-secondary group-hover/candidate:text-white transition-all">
                                                                {app.user?.name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-job-dark flex items-center gap-2 group-hover/candidate:text-job-secondary transition-colors">
                                                                    {app.user?.name}
                                                                    {app.aiMatch?.matchPercentage >= 90 && (
                                                                        <span className="bg-amber-400 text-white text-[8px] px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                                                            <Sparkles size={8} /> ELITE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.user?.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-sm text-job-dark">{app.job?.title}</div>
                                                        <div className="text-[10px] text-gray-400 font-medium">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className={`inline-flex flex-col items-center px-4 py-2 rounded-2xl border ${app.aiMatch?.matchPercentage >= 80 ? 'bg-green-50 text-green-700 border-green-100 shadow-sm shadow-green-100/50' :
                                                            app.aiMatch?.matchPercentage >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-sm shadow-amber-100/50' :
                                                                'bg-gray-50 text-gray-500 border-gray-100'
                                                            }`}>
                                                            <span className="text-base font-black tracking-tighter">{app.aiMatch?.matchPercentage || 0}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${app.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                app.status === 'Shortlisted' ? 'bg-job-primary/10 text-job-primary border-job-primary/20 ring-4 ring-job-primary/5' :
                                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                            }`}>
                                                            {app.status === 'Accepted' && <CheckCircle2 size={12} />}
                                                            {app.status === 'Rejected' && <XCircle size={12} />}
                                                            {app.status === 'Pending' && <Clock size={12} />}
                                                            {app.status === 'Shortlisted' && <Sparkles size={12} />}
                                                            <span>{app.status}</span>
                                                        </span>
                                                    </td>                                                     <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <select
                                                                className="bg-white border border-gray-200 rounded-xl text-[10px] font-black px-3 py-2 outline-none focus:ring-4 focus:ring-job-primary/5 focus:border-job-primary transition-all"
                                                                value={app.status}
                                                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Reviewed">Reviewed</option>
                                                                <option value="Shortlisted">Shortlisted</option>
                                                                <option value="Accepted">Accepted</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                            {app.status === 'Shortlisted' && (
                                                                <button
                                                                    onClick={() => handleStartChat(app)}
                                                                    title="Message this candidate"
                                                                    className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    <MessageSquare size={12} />
                                                                    <span>Message</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="border-none">
                                                    <td colSpan="5" className="px-6 pb-6 pt-0">
                                                        <div className="bg-job-neutral/30 rounded-2xl p-4 border border-white/60 flex flex-wrap gap-6 items-center">
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">AI Reasoning</p>
                                                                <p className="text-xs text-job-dark font-medium italic">"{app.aiMatch?.reason || 'No AI reasoning available yet.'}"</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 border-l border-white/40 pl-6">
                                                                <div className="text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">Education</p>
                                                                    <p className="text-xs font-black text-job-secondary">{app.educationRank > 0 ? ['None', 'Basic', 'Diploma', 'Bachelor', 'Master', 'PHD'][app.educationRank] : 'N/A'}</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">Skill Match</p>
                                                                    <p className="text-xs font-black text-job-primary">{app.skillMatchCount || 0} Met</p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-[8px] font-black text-gray-400 uppercase">Exp Blocks</p>
                                                                    <p className="text-xs font-black text-job-accent">{app.experienceCount || 0}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <JobFormModal
                isOpen={isJobModalOpen}
                onClose={() => { setIsJobModalOpen(false); setEditingJob(null); }}
                onSuccess={fetchData}
                job={editingJob}
            />

            <CandidateProfileModal 
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                candidate={selectedApp?.user}
                application={selectedApp}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, variant }) => {
    const variants = {
        primary: "!bg-job-primary !text-white",
        secondary: "!bg-job-secondary !text-white",
        accent: "!bg-job-accent !text-white",
        success: "!bg-green-600 !text-white",
    };

    return (
        <Card className={`p-8 border-none ${variants[variant]} shadow-2xl`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">{label}</h3>
                    <div className="text-4xl font-black">{value}</div>
                </div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                    <Icon size={28} />
                </div>
            </div>
        </Card>
    );
};

export default ProviderDashboard;
