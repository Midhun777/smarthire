import { useState, useContext } from 'react';
import { MapPin, Briefcase, IndianRupee, Sparkles, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const JobCard = ({ job, matchPercentage, reason, savedJobIds = [], onBookmarkChange }) => {
    const { user } = useContext(AuthContext);

    const isJobSeeker = user && (user.role === 'job_seeker' || user.role === 'user');
    const [isSaved, setIsSaved] = useState(() => savedJobIds.includes(job?._id));
    const [bookmarking, setBookmarking] = useState(false);

    const handleBookmark = async (e) => {
        e.preventDefault(); // don't navigate
        e.stopPropagation();
        if (!user || !isJobSeeker) return toast.error('Please log in as a job seeker');
        setBookmarking(true);
        try {
            const { data } = await api.post(`/users/saved-jobs/${job._id}`);
            setIsSaved(data.saved);
            toast.success(data.saved ? '📌 Job saved to your board!' : 'Job removed from saved list');
            if (onBookmarkChange) onBookmarkChange(job._id, data.saved, data.savedJobs);
        } catch {
            toast.error('Failed to update bookmark');
        } finally {
            setBookmarking(false);
        }
    };

    return (
        <Card className="flex flex-col h-full group">
            {/* Top row: bookmark + match badge */}
            {(isJobSeeker || matchPercentage) && (
                <div className="flex items-center justify-between mb-4 min-h-[2rem]">
                    {isJobSeeker ? (
                        <button
                            onClick={handleBookmark}
                            disabled={bookmarking}
                            title={isSaved ? 'Remove bookmark' : 'Save this job'}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border shrink-0 ${
                                isSaved
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-500 shadow-sm'
                                    : 'bg-white border-gray-100 text-gray-300 opacity-0 group-hover:opacity-100 hover:border-indigo-200 hover:text-indigo-400'
                            } ${bookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                    ) : <span />}

                    {matchPercentage ? (
                        <Badge variant="success" className="shadow-sm shadow-green-200 shrink-0">
                            <div className="flex items-center space-x-1">
                                <Sparkles size={12} />
                                <span>{matchPercentage}% Match</span>
                            </div>
                        </Badge>
                    ) : <span />}
                </div>
            )}

            <div className="flex-grow">
                <div className="mb-6">
                    <h3 className="text-xl font-extrabold text-job-dark group-hover:text-job-primary transition-colors cursor-pointer">
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-bold mt-1 tracking-tight">{job.company}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="gray">
                        <div className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span>{job.location}</span>
                        </div>
                    </Badge>
                    <Badge variant="primary">
                        <div className="flex items-center space-x-1">
                            <Briefcase size={12} />
                            <span>{job.type}</span>
                        </div>
                    </Badge>
                    {job.salaryRange && (
                        <Badge variant="success">
                            <div className="flex items-center space-x-1">
                                <IndianRupee size={12} />
                                <span>{job.salaryRange}</span>
                            </div>
                        </Badge>
                    )}
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {job.description}
                </p>

                {reason && (
                    <div className="bg-job-primary/5 border border-job-primary/10 p-4 rounded-2xl mb-6 relative overflow-hidden group/insight">
                        <div className="absolute top-0 left-0 w-1 h-full bg-job-primary" />
                        <h4 className="text-xs font-extrabold text-job-primary uppercase tracking-widest mb-1">AI Insight</h4>
                        <p className="text-sm text-job-primary/80 font-medium mb-3 leading-tight">
                            {reason}
                        </p>
                        {job.missingSkills?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-job-primary/60 mb-2">Skills to grow:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {job.missingSkills.map((skill, idx) => (
                                        <span key={idx} className="px-2 py-0.5 bg-white/50 border border-job-primary/10 rounded-md text-[10px] font-bold text-job-primary">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Link to={`/jobs/${job._id}`} className="block w-full">
                <Button variant="ghost" className="w-full justify-center">
                    View Details
                </Button>
            </Link>
        </Card>
    );
};

export default JobCard;
