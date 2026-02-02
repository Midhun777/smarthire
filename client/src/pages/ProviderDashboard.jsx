import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import {
    Plus, Briefcase, Users, Search,
    Filter, ExternalLink, Edit3, Trash2,
    CheckCircle2, XCircle, Clock, ChevronRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';
import JobFormModal from '../components/JobFormModal';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [activeTab, setActiveTab] = useState('listings');
    const [appSearch, setAppSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs/provider'),
                api.get('/applications/provider')
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            setFilteredApps(appsRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Filter applicants
    useEffect(() => {
        const filtered = applications.filter(app =>
            app.user?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
            app.job?.title?.toLowerCase().includes(appSearch.toLowerCase())
        );
        setFilteredApps(filtered);
    }, [appSearch, applications]);

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
                    <p className="text-gray-500 font-medium">Manage your active missions and candidate deployments.</p>
                </div>
                <Button
                    onClick={() => { setEditingJob(null); setIsJobModalOpen(true); }}
                    icon={Plus}
                    className="shadow-xl shadow-job-primary/20"
                >
                    Deploy New Mission
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Briefcase}
                    label="Active Missions"
                    value={jobs.length}
                    variant="primary"
                />
                <StatCard
                    icon={Users}
                    label="Total Candidates"
                    value={applications.length}
                    variant="secondary"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Hires Secured"
                    value={applications.filter(a => a.status === 'Accepted').length}
                    variant="accent"
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
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find candidates..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-job-secondary/20 focus:border-job-secondary transition-all outline-none text-sm font-medium"
                            value={appSearch}
                            onChange={(e) => setAppSearch(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* List View */}
            {activeTab === 'listings' ? (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.length === 0 ? (
                        <Card className="text-center py-20 bg-gray-50/50 border-dashed border-2">
                            <Briefcase className="mx-auto w-12 h-12 mb-4 opacity-10" />
                            <p className="font-bold text-gray-400">No active missions deployed yet.</p>
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
                                    <div className="flex items-center space-x-3 self-end md:self-center">
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
                                            <tr key={app._id} className="hover:bg-white/40 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="font-black text-job-dark">{app.user?.name}</div>
                                                    <div className="text-xs text-gray-400">{app.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-sm text-job-dark">{app.job?.title}</div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-xl border ${app.aiMatch?.matchPercentage >= 80 ? 'bg-green-50 text-green-700 border-green-100' :
                                                            app.aiMatch?.matchPercentage >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                'bg-gray-50 text-gray-500 border-gray-100'
                                                        }`}>
                                                        <span className="text-sm font-black tracking-tighter">{app.aiMatch?.matchPercentage || 0}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${app.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            app.status === 'Shortlisted' ? 'bg-job-primary/10 text-job-primary border-job-primary/20' :
                                                                'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                        {app.status === 'Accepted' && <CheckCircle2 size={12} />}
                                                        {app.status === 'Rejected' && <XCircle size={12} />}
                                                        {app.status === 'Pending' && <Clock size={12} />}
                                                        <span>{app.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            className="bg-white border border-gray-200 rounded-lg text-[10px] font-black px-2 py-1 outline-none focus:ring-2 focus:ring-job-primary/20"
                                                            value={app.status}
                                                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Reviewed">Reviewed</option>
                                                            <option value="Shortlisted">Shortlisted</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
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
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, variant }) => {
    const variants = {
        primary: "!bg-job-primary !text-white",
        secondary: "!bg-job-secondary !text-white",
        accent: "!bg-job-accent !text-white"
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
