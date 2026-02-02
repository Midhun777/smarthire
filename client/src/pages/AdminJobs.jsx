import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import JobFormModal from '../components/JobFormModal';
import {
    Briefcase,
    Plus,
    Pencil,
    Trash2,
    MapPin,
    Building2,
    Search,
    Clock,
    Filter
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (error) {
            toast.error('Error fetching jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job posting terminated');
            fetchJobs();
        } catch (error) {
            toast.error('Error deleting job');
        }
    };

    const handleEdit = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedJob(null);
        setIsModalOpen(true);
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Mission Database</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-job-dark tracking-tighter">Mission Control</h2>
                    <p className="text-gray-500 font-medium mt-2 italic">Management of all active and historical job postings.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-full md:w-64">
                        <Input
                            placeholder="SEARCH MISSIONS..."
                            icon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 border-white/60 shadow-xl shadow-job-primary/5"
                        />
                    </div>
                    <Button
                        onClick={handleAddNew}
                        className="h-12 px-6 shadow-xl shadow-job-primary/20"
                        icon={Plus}
                    >
                        New Posting
                    </Button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-white/60 shadow-2xl shadow-job-primary/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-job-neutral/30">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Mission</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent Entity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Classification</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Geographic Node</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/50">
                            {filteredJobs.map((job) => (
                                <tr key={job._id} className="group hover:bg-job-primary/[0.02] transition-colors duration-300">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-job-primary/10 border border-job-primary/5 flex items-center justify-center text-job-primary group-hover:scale-110 transition-transform">
                                                <Briefcase size={20} />
                                            </div>
                                            <span className="text-sm font-black text-job-dark tracking-tight">{job.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-xs font-bold">
                                            <Building2 size={14} className="mr-2 opacity-50" />
                                            {job.company}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <Badge variant="secondary" className="px-3 py-1 font-black text-[10px] tracking-widest uppercase border-0">
                                            {job.type}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-xs font-bold">
                                            <MapPin size={14} className="mr-2 opacity-50" />
                                            {job.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="h-10 w-10 p-0 text-job-primary border-2 border-gray-100 hover:border-job-primary/20 hover:bg-job-primary/5"
                                                onClick={() => handleEdit(job)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-100"
                                                onClick={() => handleDelete(job._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredJobs.length === 0 && (
                    <div className="py-20 text-center">
                        <Filter size={40} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matching missions discovered</p>
                    </div>
                )}
            </Card>

            <JobFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchJobs}
                job={selectedJob}
            />
        </div>
    );
};

export default AdminJobs;

