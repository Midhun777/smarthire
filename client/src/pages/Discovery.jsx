import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import JobCard from '../components/JobCard';
import { Sparkles, Compass, Rocket, Brain, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Discovery = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState(0);
    const { user, updateUser } = useContext(AuthContext);

    const userIsComplete = user?.isProfileComplete || (user?.skills && user?.skills?.length > 0);


    const loadingSteps = [
        "Initializing neural career vector...",
        "Parsing skill-market resonance...",
        "Executing role-fit simulation...",
        "Synthesizing match reasoning...",
        "Calibrating skill gap analysis...",
        "Finalizing personalised discovery feed..."
    ];

    const fetchRecommendations = async (forceRefresh = false) => {
        setLoading(true);
        try {
            const { data } = await api.post('/jobs/recommend', { refresh: forceRefresh });
            const normalized = data.map(item => ({
                ...item.job,
                matchPercentage: item.matchPercentage,
                reason: item.reason,
                missingSkills: item.missingSkills
            }));
            setRecommendedJobs(normalized);
            localStorage.setItem(`discovery_jobs_${user?._id}`, JSON.stringify(normalized));
        } catch (err) {
            console.error("Discovery failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingSteps.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [loading]);

    useEffect(() => {
        // Fetch fresh user data to ensure context and localStorage aren't stale
        const syncUser = async () => {
            if (user && updateUser) {
                try {
                    const { data } = await api.get('/users/profile');
                    updateUser(data);
                } catch (error) {
                    console.error('Failed to sync user profile in Discovery', error);
                }
            }
        };
        syncUser();
    }, []);

    useEffect(() => {
        // Load from cache first
        const cached = localStorage.getItem(`discovery_jobs_${user?._id}`);
        if (cached) {
            try {
                setRecommendedJobs(JSON.parse(cached));
                setLoading(false); // Stop main loading if we have cache
            } catch (e) {
                console.error("Cache parse error", e);
            }
        }

        if (user) {
            fetchRecommendations(false);
        }
    }, [user]);

    const handleRefresh = () => {
        fetchRecommendations(true);
    };

    if (loading && recommendedJobs.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4">
            <div className="relative">
                <div className="w-24 h-24 border-8 border-job-primary/10 border-t-job-primary rounded-full animate-spin" />
                <Brain className="absolute inset-0 m-auto text-job-primary animate-pulse" size={32} />
            </div>
            <div className="space-y-4 max-w-xs mx-auto">
                <h2 className="text-xl font-black text-job-dark tracking-tight uppercase">Analyzing your career path</h2>
                <div className="space-y-2">
                    <p className="text-job-primary font-bold animate-pulse tracking-widest uppercase text-[10px] min-h-[1rem]">
                        {loadingSteps[loadingStep]}
                    </p>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                        <div
                            className="bg-job-primary h-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-20 px-4">
            {/* Discovery Hero */}
            <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-job-dark via-job-dark to-job-primary/20 text-white p-12 md:p-20 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-job-primary/40 via-transparent to-transparent " />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                            <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Smart Match Discovery</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                            Jobs built for <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-job-primary via-job-accent to-job-secondary">
                                your DNA.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-lg">
                            We've analyzed your skills and experience against thousands of roles to find where you'll truly excel.
                        </p>

                        {!userIsComplete && (
                            <Link to="/complete-profile" className="inline-block">
                                <Button variant="primary" className="px-10 py-5 rounded-2xl shadow-2xl shadow-job-primary/40 group" icon={Rocket}>
                                    Refine Matches
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-6 relative">
                        <div className="absolute inset-0 bg-job-primary/5 blur-[100px] rounded-full" />
                        <Card className="bg-white/5 border-white/10 p-8 backdrop-blur-md transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Brain className="text-job-primary mb-4" size={32} />
                            <h3 className="font-black text-lg mb-2">Neural Scan</h3>
                            <p className="text-sm text-gray-400 font-medium">Mapped your skills to {recommendedJobs.length} live openings.</p>
                        </Card>
                        <Card className="bg-white/5 border-white/10 p-8 backdrop-blur-md transform rotate-3 hover:rotate-0 transition-transform duration-500 translate-y-12">
                            <Target className="text-job-accent mb-4" size={32} />
                            <h3 className="font-black text-lg mb-2">High Precision</h3>
                            <p className="text-sm text-gray-400 font-medium">Top matches exceed 90% technical resonance.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Personalized Feed */}
            <section className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-job-dark tracking-tight">Your Personal Feed</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center">
                            Sorted by AI Resonance Score
                            <Sparkles size={14} className="ml-2 text-amber-500" />
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={handleRefresh}
                            className={`text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border-2 transition-all flex items-center space-x-2 ${loading ? 'bg-job-primary/10 border-job-primary/20 text-job-primary' : 'bg-gray-50 border-gray-100 hover:border-job-primary/30 hover:bg-white text-gray-500 hover:text-job-primary'
                                }`}
                            loading={loading}
                        >
                            <Sparkles size={14} className={loading ? 'animate-spin' : ''} />
                            <span>{loading ? 'Refreshing...' : 'Refresh Matches'}</span>
                        </Button>
                        <div className="flex items-center space-x-2 text-sm font-bold text-gray-400 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">
                            <span>Total Matches:</span>
                            <span className="text-job-primary font-black">{recommendedJobs.length}</span>
                        </div>
                    </div>
                </div>

                {recommendedJobs.length === 0 && !loading ? (
                    <Card className="text-center py-32 bg-gray-50/50 border-dashed border-2 rounded-[3rem]">
                        <div className="max-w-md mx-auto space-y-8 px-4">
                            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto text-gray-200">
                                <Compass size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-job-dark">
                                    {!userIsComplete ? 'Searching for your orbit...' : 'No perfect matches found yet'}
                                </h3>
                                <p className="text-gray-500 font-medium">
                                    {!userIsComplete 
                                        ? 'We need a bit more info to calculate your perfect matches. Complete your profile or upload a resume to unlock your feed.'
                                        : 'We couldn\'t find any roles that strongly match your current skill profile. Check back later or try adding more skills.'}
                                </p>
                            </div>
                            {!userIsComplete && (
                                <Link to="/complete-profile">
                                    <Button variant="primary" className="px-12 py-4">Complete Profile</Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
                        {loading && recommendedJobs.length > 0 && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center transition-all">
                                <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex items-center space-x-4">
                                    <div className="w-6 h-6 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
                                    <span className="text-sm font-black text-job-dark uppercase tracking-widest">Re-calibrating...</span>
                                </div>
                            </div>
                        )}
                        {recommendedJobs.map((job, idx) => (
                            <div key={job._id} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                                <JobCard
                                    job={job}
                                    matchPercentage={job.matchPercentage}
                                    reason={job.reason}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Future Growth Section */}
            {recommendedJobs.some(j => j.missingSkills?.length > 0) && (
                <section className="bg-job-neutral/30 rounded-[3rem] p-12 md:p-16 border border-white">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-4xl font-black text-job-dark tracking-tight">Bridge the Gap</h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                Our AI identified skills frequently requested by your top matches that aren't yet in your profile. Mastering these could unlock even higher-tier roles.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {[...new Set(recommendedJobs.flatMap(j => j.missingSkills || []))].slice(0, 8).map((skill, i) => (
                                    <span key={i} className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-black text-job-primary shadow-sm hover:shadow-md transition-shadow">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <Card className="bg-job-dark text-white p-10 space-y-6 relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-48 h-48 bg-job-primary/10 rounded-full blur-3xl -mb-24 -mr-24" />
                                <h3 className="text-2xl font-black">Ready to scale?</h3>
                                <p className="text-gray-400 font-medium">Update your profile once you've acquired these skills to see your match percentage soar.</p>
                                <Link to="/profile" className="block">
                                    <Button variant="ghost" className="w-full justify-center bg-white/5 hover:bg-white/10 border-white/10 text-white">
                                        Go to Profile
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Discovery;
