import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase, MapPin, Calendar, ArrowUpRight,
    StickyNote, Check, X, Sparkles, Bookmark
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusStyles = {
    Saved:       { border: 'border-l-indigo-400',   bg: 'bg-indigo-50',   text: 'text-indigo-600',   dot: 'bg-indigo-400'   },
    Pending:     { border: 'border-l-amber-400',    bg: 'bg-amber-50',    text: 'text-amber-600',    dot: 'bg-amber-400'    },
    Reviewed:    { border: 'border-l-sky-400',      bg: 'bg-sky-50',      text: 'text-sky-600',      dot: 'bg-sky-400'      },
    Shortlisted: { border: 'border-l-violet-400',   bg: 'bg-violet-50',   text: 'text-violet-600',   dot: 'bg-violet-400'   },
    Accepted:    { border: 'border-l-emerald-400',  bg: 'bg-emerald-50',  text: 'text-emerald-600',  dot: 'bg-emerald-400'  },
    Rejected:    { border: 'border-l-rose-400',     bg: 'bg-rose-50',     text: 'text-rose-600',     dot: 'bg-rose-400'     },
};

const KanbanCard = ({ application, isSaved = false, onUnsave }) => {
    const job = isSaved ? application : application?.job;
    const appId = isSaved ? null : application?._id;
    const status = isSaved ? 'Saved' : (application?.status || 'Pending');
    const style = statusStyles[status] || statusStyles['Pending'];

    const [editing, setEditing] = useState(false);
    const [note, setNote] = useState(application?.userNote || '');
    const [savedNote, setSavedNote] = useState(application?.userNote || '');

    const handleSaveNote = async () => {
        if (!appId) return;
        try {
            await api.patch(`/applications/${appId}/note`, { note });
            setSavedNote(note);
            setEditing(false);
            toast.success('Note saved');
        } catch {
            toast.error('Failed to save note');
        }
    };

    const handleCancelNote = () => {
        setNote(savedNote);
        setEditing(false);
    };

    const handleUnsave = async () => {
        if (onUnsave) onUnsave(job._id);
    };

    if (!job) return null;

    return (
        <div className={`group bg-white rounded-2xl border border-gray-100 border-l-4 ${style.border} shadow-sm hover:shadow-xl hover:shadow-job-primary/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}>
            {/* Header */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-grow min-w-0">
                        <h3 className="font-black text-job-dark text-sm leading-snug group-hover:text-job-primary transition-colors truncate">
                            {job.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                            {job.company}
                        </p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <span>{status === 'Pending' ? 'Applied' : status}</span>
                    </span>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.location && (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <MapPin size={10} />
                            <span>{job.location}</span>
                        </span>
                    )}
                    {job.type && (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <Briefcase size={10} />
                            <span>{job.type}</span>
                        </span>
                    )}
                </div>

                {/* Match percentage (if available) */}
                {application?.aiMatch?.matchPercentage > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                        <Sparkles size={12} className="text-amber-500" />
                        <div className="flex-grow bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                                style={{ width: `${application.aiMatch.matchPercentage}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-gray-500">{application.aiMatch.matchPercentage}%</span>
                    </div>
                )}

                {/* Date */}
                <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">
                    <Calendar size={10} />
                    <span>
                        {isSaved ? 'Saved' : 'Applied'} {new Date(application?.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>

                {/* Note section (only for applied jobs) */}
                {!isSaved && (
                    <div className="border-t border-gray-50 pt-3">
                        {editing ? (
                            <div className="space-y-2">
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Add a note (e.g. Sent follow-up email)..."
                                    rows={2}
                                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-job-primary font-medium text-gray-600"
                                />
                                <div className="flex items-center space-x-2">
                                    <button onClick={handleSaveNote} className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest bg-job-primary text-white px-3 py-1.5 rounded-lg hover:bg-job-primary/90 transition-colors">
                                        <Check size={10} /><span>Save</span>
                                    </button>
                                    <button onClick={handleCancelNote} className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 px-2 py-1.5">
                                        <X size={10} /><span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-400 hover:text-job-primary transition-colors group/note"
                            >
                                <StickyNote size={11} className="group-hover/note:text-job-primary" />
                                <span className="truncate max-w-[150px]">{savedNote || 'Add a note...'}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between bg-gray-50/50">
                <Link
                    to={`/jobs/${job._id}`}
                    className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-job-primary hover:text-job-primary/80 transition-colors"
                >
                    <span>View Job</span>
                    <ArrowUpRight size={11} />
                </Link>
                {isSaved && (
                    <button
                        onClick={handleUnsave}
                        className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-colors"
                    >
                        <Bookmark size={11} />
                        <span>Unsave</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default KanbanCard;
