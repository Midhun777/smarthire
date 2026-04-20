import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    FileText,
    Search,
    Calendar,
    Briefcase,
    User,
    CheckCircle,
    Clock,
    XCircle,
    Filter
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/admin/applications');
                setApplications(data);
            } catch (error) {
                toast.error('Error fetching applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app =>
        (app.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.job?.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'applied': return <Badge variant="primary" icon={Clock}>Applied</Badge>;
            case 'shortlisted': return <Badge variant="success" icon={CheckCircle}>Shortlisted</Badge>;
            case 'rejected': return <Badge variant="danger" icon={XCircle}>Rejected</Badge>;
            default: return <Badge variant="gray">{status}</Badge>;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Application Data</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-job-dark tracking-tighter">Application Monitoring</h2>
                    <p className="text-gray-500 font-medium mt-2 italic">Global oversight of all candidate submissions.</p>
                </div>
                <div className="w-full md:w-80">
                    <Input
                        placeholder="SEARCH APPLICANTS OR JOBS..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 border-white/60 shadow-xl shadow-job-primary/5"
                    />
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-white/60 shadow-2xl shadow-job-primary/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-job-neutral/30">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Opportunity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Submitted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/50">
                            {filteredApplications.map((app) => (
                                <tr key={app._id} className="group hover:bg-job-primary/[0.02] transition-colors duration-300">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-full bg-job-primary/10 flex items-center justify-center text-job-primary">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-job-dark tracking-tight">{app.user?.name || 'Deleted User'}</div>
                                                <div className="text-[10px] font-bold text-gray-400">{app.user?.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-gray-400"><Briefcase size={16} /></div>
                                            <div>
                                                <div className="text-sm font-black text-job-dark tracking-tight">{app.job?.title || 'Unknown Job'}</div>
                                                <div className="text-[10px] font-bold text-job-primary uppercase tracking-widest">{app.job?.company || 'Unknown Company'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        {getStatusBadge(app.status)}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-xs font-bold">
                                            <Calendar size={14} className="mr-2 opacity-50" />
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredApplications.length === 0 && (
                    <div className="py-20 text-center">
                        <FileText size={40} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No applications found</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminApplications;
