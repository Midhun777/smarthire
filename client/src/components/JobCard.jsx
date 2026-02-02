import { MapPin, Briefcase, IndianRupee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const JobCard = ({ job, matchPercentage, reason }) => {
    return (
        <Card className="flex flex-col h-full relative group">
            {matchPercentage && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge variant="success" className="animate-pulse shadow-sm shadow-green-200">
                        <div className="flex items-center space-x-1">
                            <Sparkles size={12} />
                            <span>{matchPercentage}% Match</span>
                        </div>
                    </Badge>
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
                        <p className="text-sm text-job-primary/80 font-medium leading-tight">
                            {reason}
                        </p>
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

