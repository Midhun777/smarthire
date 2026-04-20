import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';
import { MessageSquare, User, Briefcase, Search, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatInbox = () => {
    const { user } = useContext(AuthContext);
    const { setUnreadCount } = useChat();
    const [searchParams] = useSearchParams();
    const convParam = searchParams.get('conv');
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');

    const isProvider = user?.role === 'job_provider';

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
            // Auto-select if navigated with ?conv=id (from ProviderDashboard)
            if (convParam && !selected) {
                const target = data.find(c => c._id === convParam);
                if (target) setSelected(target);
            }
            // Refresh global unread count
            const totalUnread = data.reduce((sum, c) => {
                return sum + (isProvider ? c.providerUnread : c.seekerUnread);
            }, 0);
            setUnreadCount(totalUnread);
        } catch {
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // After opening a conv, refresh to update unread counts
    const handleSelectConversation = (conv) => {
        setSelected(conv);
        // Mark as read after a tick
        setTimeout(() => {
            setConversations(prev =>
                prev.map(c =>
                    c._id === conv._id
                        ? { ...c, providerUnread: 0, seekerUnread: 0 }
                        : c
                )
            );
            fetchConversations();
        }, 1000);
    };

    const filteredConvs = conversations.filter(conv => {
        const other = isProvider ? conv.seekerId : conv.providerId;
        const jobTitle = conv.jobId?.title || '';
        const name = other?.name || '';
        const q = search.toLowerCase();
        return name.toLowerCase().includes(q) || jobTitle.toLowerCase().includes(q);
    });

    const getUnreadForConv = (conv) => isProvider ? conv.providerUnread : conv.seekerUnread;

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="inline-flex items-center space-x-2 bg-job-primary/10 text-job-primary px-4 py-2 rounded-full mb-4 border border-job-primary/20">
                    <MessageSquare size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Messaging</span>
                </div>
                <h1 className="text-4xl font-black text-job-dark tracking-tighter">Conversations</h1>
                <p className="text-gray-500 font-medium mt-2">
                    Job-scoped, professional communication between providers and candidates.
                </p>
            </div>

            <div className="flex h-[calc(100vh-280px)] min-h-[500px] gap-6 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl shadow-job-primary/5 bg-white">
                {/* Left panel — conversation list */}
                <div className="w-80 flex-shrink-0 border-r border-gray-100 flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-job-primary/40 transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-grow overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-6 h-6 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
                            </div>
                        ) : filteredConvs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center px-4 space-y-3">
                                <Inbox size={32} className="text-gray-200" />
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                                    {search ? 'No results found' : 'No conversations yet'}
                                </p>
                                {!isProvider && !search && (
                                    <p className="text-xs font-medium text-gray-400 leading-relaxed">
                                        Job providers can message you once you're shortlisted for a position.
                                    </p>
                                )}
                            </div>
                        ) : (
                            filteredConvs.map((conv) => {
                                const other = isProvider ? conv.seekerId : conv.providerId;
                                const unread = getUnreadForConv(conv);
                                const isActive = selected?._id === conv._id;

                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => handleSelectConversation(conv)}
                                        className={`w-full px-4 py-4 flex items-start space-x-3 transition-all border-b border-gray-50 text-left hover:bg-job-primary/5 ${isActive ? 'bg-job-primary/5 border-l-4 border-l-job-primary' : ''}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-job-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {other?.profilePicture ? (
                                                <img src={`http://localhost:5000/${other.profilePicture}`} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <User size={18} />
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-black truncate ${unread > 0 ? 'text-job-dark' : 'text-gray-600'}`}>
                                                    {other?.name}
                                                </p>
                                                <span className="text-[10px] font-bold text-gray-300 ml-2 shrink-0">
                                                    {formatTime(conv.lastMessageAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-1">
                                                <Briefcase size={10} className="text-gray-300 shrink-0" />
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                                                    {conv.jobId?.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-xs truncate ${unread > 0 ? 'font-bold text-gray-700' : 'font-medium text-gray-400'}`}>
                                                    {conv.lastMessage || 'No messages yet'}
                                                </p>
                                                {unread > 0 && (
                                                    <span className="w-5 h-5 bg-job-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 ml-2">
                                                        {unread > 9 ? '9+' : unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right panel — chat window or empty state */}
                <div className="flex-grow">
                    {selected ? (
                        <ChatWindow
                            conversation={selected}
                            onClose={() => setSelected(null)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-8">
                            <div className="w-20 h-20 bg-job-primary/5 rounded-[2rem] flex items-center justify-center">
                                <MessageSquare size={40} className="text-job-primary/30" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-300">Select a conversation</h3>
                                <p className="text-sm font-medium text-gray-300 max-w-xs leading-relaxed">
                                    Choose a conversation from the left to view messages and reply.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInbox;
