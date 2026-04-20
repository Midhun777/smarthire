import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import KanbanCard from '../components/KanbanCard';
import toast from 'react-hot-toast';
import {
    Bookmark, Inbox, Clock, Eye, Star, CheckCircle2,
    XCircle, LayoutDashboard, ArrowUpRight, Sparkles, RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';

const COLUMNS = [
    {
        id: 'saved',
        label: 'Saved',
        icon: Bookmark,
        color: 'indigo',
        description: 'Jobs you bookmarked',
        gradient: 'from-indigo-500 to-indigo-400',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        iconBg: 'bg-indigo-100',
        iconText: 'text-indigo-600',
    },
    {
        id: 'applied',
        label: 'Applied',
        statuses: ['Pending'],
        icon: Inbox,
        color: 'amber',
        description: 'Applications awaiting review',
        gradient: 'from-amber-500 to-amber-400',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconText: 'text-amber-600',
    },
    {
        id: 'reviewed',
        label: 'In Review',
        statuses: ['Reviewed'],
        icon: Eye,
        color: 'sky',
        description: 'Being evaluated by recruiter',
        gradient: 'from-sky-500 to-sky-400',
        bg: 'bg-sky-50',
        border: 'border-sky-100',
        iconBg: 'bg-sky-100',
        iconText: 'text-sky-600',
    },
    {
        id: 'shortlisted',
        label: 'Shortlisted',
        statuses: ['Shortlisted'],
        icon: Star,
        color: 'violet',
        description: "You're on their radar!",
        gradient: 'from-violet-500 to-violet-400',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        iconBg: 'bg-violet-100',
        iconText: 'text-violet-600',
    },
    {
        id: 'decision',
        label: 'Decision',
        statuses: ['Accepted', 'Rejected'],
        icon: CheckCircle2,
        color: 'emerald',
        description: 'Final outcome received',
        gradient: 'from-emerald-500 to-rose-400',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        iconBg: 'bg-emerald-100',
        iconText: 'text-emerald-600',
    },
];

const KanbanTracker = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('board'); // 'board' | 'list'

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appsRes, savedRes] = await Promise.all([
                api.get('/applications/my'),
                api.get('/users/saved-jobs'),
            ]);
            setApplications(appsRes.data);
            setSavedJobs(savedRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load your board');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUnsave = async (jobId) => {
        try {
            await api.post(`/users/saved-jobs/${jobId}`);
            setSavedJobs(prev => prev.filter(j => j._id !== jobId));
            toast.success('Job removed from saved list');
        } catch {
            toast.error('Failed to unsave the job');
        }
    };

    const getColumnCards = (col) => {
        if (col.id === 'saved') return savedJobs;
        return applications.filter(app => col.statuses.includes(app.status));
    };

    const totalCards = applications.length + savedJobs.length;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Loading your board...</p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-job-primary/10 text-job-primary px-4 py-2 rounded-full mb-4 border border-job-primary/20">
                        <LayoutDashboard size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Job Pipeline</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-job-dark tracking-tighter">My Board</h1>
                    <p className="text-gray-500 font-medium text-lg mt-2">
                        Track your entire job search — from bookmarks to offers.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchData}
                        className="p-3 bg-white border border-gray-100 rounded-xl hover:border-job-primary/30 hover:bg-job-primary/5 text-gray-400 hover:text-job-primary transition-all"
                        title="Refresh board"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <Link to="/dashboard">
                        <Button variant="ghost" icon={ArrowUpRight} className="bg-white border-2 border-job-primary/10 hover:border-job-primary shadow-xl shadow-job-primary/5">
                            Find More Jobs
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {COLUMNS.map(col => {
                    const count = getColumnCards(col).length;
                    const Icon = col.icon;
                    return (
                        <div key={col.id} className={`${col.bg} ${col.border} border rounded-2xl p-4 flex items-center space-x-3 transition-all hover:scale-105`}>
                            <div className={`w-10 h-10 ${col.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                                <Icon size={18} className={col.iconText} />
                            </div>
                            <div>
                                <p className={`text-2xl font-black ${col.iconText}`}>{count}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{col.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {totalCards === 0 ? (
                <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl">
                    <div className="w-24 h-24 bg-job-primary/5 rounded-[2rem] flex items-center justify-center text-job-primary mx-auto mb-8">
                        <Sparkles size={40} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black text-job-dark mb-4 tracking-tight">Your board is empty</h2>
                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
                        Bookmark jobs you like or apply for positions — they'll appear here so you can track your progress.
                    </p>
                    <Link to="/dashboard">
                        <Button variant="primary" className="px-10 h-14 text-lg shadow-2xl shadow-job-primary/20" icon={ArrowUpRight}>
                            Explore Jobs
                        </Button>
                    </Link>
                </div>
            ) : (
                /* Kanban Board */
                <div className="flex gap-5 overflow-x-auto pb-6" style={{ scrollbarWidth: 'thin' }}>
                    {COLUMNS.map(col => {
                        const cards = getColumnCards(col);
                        const Icon = col.icon;
                        return (
                            <div
                                key={col.id}
                                className="flex-shrink-0 w-72 flex flex-col"
                            >
                                {/* Column header */}
                                <div className={`flex items-center justify-between mb-4 p-4 rounded-2xl ${col.bg} border ${col.border}`}>
                                    <div className="flex items-center space-x-2.5">
                                        <div className={`w-8 h-8 ${col.iconBg} rounded-xl flex items-center justify-center`}>
                                            <Icon size={16} className={col.iconText} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black uppercase tracking-widest ${col.iconText}`}>{col.label}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{col.description}</p>
                                        </div>
                                    </div>
                                    <span className={`w-7 h-7 rounded-full ${col.iconBg} ${col.iconText} flex items-center justify-center text-xs font-black`}>
                                        {cards.length}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="flex flex-col space-y-3 flex-grow min-h-[200px]">
                                    {cards.length === 0 ? (
                                        <div className="flex-grow flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-center px-4">
                                            <Icon size={24} className="text-gray-200 mb-2" />
                                            <p className="text-xs font-bold text-gray-300">No items here</p>
                                        </div>
                                    ) : (
                                        cards.map((item) => (
                                            <KanbanCard
                                                key={item._id}
                                                application={item}
                                                isSaved={col.id === 'saved'}
                                                onUnsave={col.id === 'saved' ? handleUnsave : undefined}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            {totalCards > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-4">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Pipeline stages:</p>
                    {COLUMNS.map(col => (
                        <span key={col.id} className={`flex items-center space-x-1.5 text-[10px] font-bold ${col.iconText} bg-white border border-gray-100 px-3 py-1.5 rounded-full`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${col.iconBg}`} />
                            <span>{col.label}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KanbanTracker;
