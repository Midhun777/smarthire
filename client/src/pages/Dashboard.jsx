import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import JobCard from '../components/JobCard';
import StatCard from '../components/StatCard';
import { LayoutDashboard, Briefcase, TrendingUp, Sparkles, ChevronRight, Users as UsersIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if user is a provider
        if (user?.role === 'job_provider') {
            navigate('/provider-dashboard');
            return;
        }

        const fetchStats = async () => {
            if (user?.role !== 'admin') {
                setStats({ users: 0, jobs: 0, applications: 0 });
                return;
            }
            try {
                const res = await api.get('/applications/stats');
                const { users, jobs, applications } = res.data;
                setStats({ users, jobs, applications });
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchStats();
        const fetchData = async () => {
            try {
                const allJobsRes = await api.get('/jobs');
                setAllJobs(allJobsRes.data);
                setFilteredJobs(allJobsRes.data);

                if (user?.skills && user.skills.length > 0) {
                    try {
                        const recommendRes = await api.post('/jobs/recommend');
                        const normalized = recommendRes.data.map(item => ({
                            ...item.job,
                            matchPercentage: item.matchPercentage,
                            reason: item.reason
                        }));
                        setRecommendedJobs(normalized);
                    } catch (err) {
                        console.log("Recommend failed", err);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Handle Search and Filter
    useEffect(() => {
        let result = allJobs;

        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            result = result.filter(job => job.type === filterType);
        }

        setFilteredJobs(result);
    }, [searchTerm, filterType, allJobs]);

    if (loading) return (
        // ... (loading UI remains the same)
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-bold animate-pulse tracking-widest uppercase text-xs">Loading Jobs</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-job-dark text-white p-8 md:p-12 shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-job-primary/20 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-job-secondary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10">
                            <Sparkles className="text-amber-400 w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">AI-Powered Job Matching</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                            Welcome back, <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-job-primary to-job-accent">
                                {user?.name || 'User'}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-medium mb-8 leading-relaxed">
                            We've found new jobs that match your skills.
                            Ready to take the next step in your career?
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Link to="/complete-profile">
                                <Button className="px-8" icon={ChevronRight}>
                                    Update Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Dashboard */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={TrendingUp} label="Total Jobs" value={stats.jobs} variant="primary" />
                <StatCard icon={UsersIcon} label="Total Users" value={stats.users} variant="secondary" />
                <StatCard icon={Briefcase} label="Applications" value={stats.applications || 0} variant="accent" />
            </section>

            {/* Onboarding Banner */}
            {user && !user.isProfileComplete && (
                <Card className="bg-job-primary/5 border-job-primary/20 p-8 md:p-12 text-center md:text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-job-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-black text-job-dark mb-3 tracking-tight">Unlock Personalized Matches</h2>
                            <p className="text-gray-500 font-medium max-w-lg mb-0 text-lg">
                                Complete your profile to let our AI analyze your skills and recommend the perfect jobs for you.
                            </p>
                        </div>
                        <Link to="/complete-profile">
                            <Button variant="primary" className="px-10 py-4 shadow-xl shadow-job-primary/30">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Recommendations */}
            {recommendedJobs.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                                <Sparkles className="text-amber-600" />
                            </div>
                            <h2 className="text-3xl font-black text-job-dark tracking-tight">Handpicked for You</h2>
                        </div>
                    </div>
                    <div className="flex space-x-6 overflow-x-auto pb-8 hide-scrollbar snap-x">
                        {recommendedJobs.map((job) => (
                            <div key={`rec-${job._id}`} className="min-w-[320px] md:min-w-[400px] snap-center">
                                <JobCard
                                    job={job}
                                    matchPercentage={job.matchPercentage}
                                    reason={job.reason}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Feed */}
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-job-primary/10 rounded-2xl flex items-center justify-center border border-job-primary/20 shadow-sm">
                            <LayoutDashboard className="text-job-primary" />
                        </div>
                        <h2 className="text-3xl font-black text-job-dark tracking-tight">
                            {recommendedJobs.length > 0 ? 'Explore More Jobs' : 'Latest Jobs'}
                        </h2>
                    </div>

                    {/* Search and Filter UI */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-2xl">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search by title, company, or location..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-job-primary/20 focus:border-job-primary transition-all font-medium text-job-dark"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-2xl">
                            {['All', 'Full-time', 'Remote', 'Contract'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === type
                                        ? 'bg-white text-job-primary shadow-sm'
                                        : 'text-gray-400 hover:text-job-dark'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredJobs.length === 0 ? (
                    <Card className="text-center py-20 bg-gray-50/50 border-dashed border-2">
                        <div className="max-w-xs mx-auto text-gray-400">
                            <Briefcase className="mx-auto w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold text-lg">No matches found</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs
                            .filter(job => !recommendedJobs.some(rec => rec._id === job._id))
                            .map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;

