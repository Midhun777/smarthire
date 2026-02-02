import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Briefcase,
    Calendar,
    Clock,
    ChevronRight,
    LayoutDashboard,
    Search,
    Inbox,
    ArrowUpRight
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/applications/my');
                setApplications(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'warning';
            case 'interview': return 'primary';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            default: return 'gray';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Syncing Applications</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-job-primary/10 text-job-primary px-4 py-2 rounded-full mb-4 border border-job-primary/20">
                        <Inbox size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Active Pipeline</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-job-dark tracking-tighter">Application Ledger</h1>
                    <p className="text-gray-500 font-medium text-lg mt-2">Historical and real-time tracking of your professional submissions.</p>
                </div>
                <Link to="/dashboard">
                    <Button variant="ghost" className="bg-white border-2 border-job-primary/10 hover:border-job-primary shadow-xl shadow-job-primary/5" icon={LayoutDashboard}>
                        Return to Hub
                    </Button>
                </Link>
            </div>

            {applications.length === 0 ? (
                <Card className="py-24 text-center border-white/40 shadow-2xl shadow-job-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-job-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-job-primary/5 rounded-[2.5rem] flex items-center justify-center text-job-primary mx-auto mb-8 relative">
                            <Briefcase size={40} strokeWidth={1.5} />
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
                                <Search size={20} className="text-job-primary" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-job-dark mb-4 tracking-tight">Ledger Empty</h2>
                        <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">You haven't initiated any deployment sequences yet. Start exploring the job frontier.</p>
                        <Link to="/dashboard">
                            <Button variant="primary" className="px-10 h-14 text-lg shadow-2xl shadow-job-primary/20" icon={ArrowUpRight}>
                                Discover Opportunities
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((app) => (
                        <Card key={app._id} className="p-8 hover:shadow-2xl hover:shadow-job-primary/10 transition-all duration-500 border-white/60 group">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex-grow space-y-4">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Badge variant={getStatusVariant(app.status)} className="px-6 py-2 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase border-2 border-white/40 shadow-sm">
                                            {app.status}
                                        </Badge>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Job ID: {app.job?._id?.slice(-6)}</span>
                                    </div>

                                    <div className="flex items-start justify-between md:justify-start gap-6">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-black text-job-dark tracking-tighter group-hover:text-job-primary transition-colors duration-300">{app.job?.title}</h3>
                                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                                <div className="flex items-center text-job-primary font-black uppercase tracking-widest text-[10px]">
                                                    <div className="w-8 h-8 bg-job-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                        <Briefcase size={14} />
                                                    </div>
                                                    {app.job?.company}
                                                </div>
                                                <div className="flex items-center text-gray-400 font-black uppercase tracking-widest text-[10px]">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Calendar size={14} />
                                                    </div>
                                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-gray-400 font-black uppercase tracking-widest text-[10px]">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Clock size={14} />
                                                    </div>
                                                    Verified {new Date(app.updatedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex shrink-0">
                                    <Link to={`/jobs/${app.job?._id}`} className="w-full">
                                        <Button
                                            variant="ghost"
                                            className="w-full h-16 px-8 bg-white border-2 border-gray-100 group-hover:border-job-primary group-hover:bg-job-primary group-hover:text-white group-hover:shadow-2xl group-hover:shadow-job-primary/20 transition-all duration-300 font-black uppercase tracking-widest text-xs"
                                            icon={ArrowUpRight}
                                        >
                                            Metadata Analysis
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;

