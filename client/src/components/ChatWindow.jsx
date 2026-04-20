import { useState, useEffect, useRef, useContext } from 'react';
import { Send, Briefcase, X, User, Wifi, WifiOff } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import toast from 'react-hot-toast';

const ChatWindow = ({ conversation, onClose }) => {
    const { user } = useContext(AuthContext);
    const { getSocket, setUnreadCount } = useChat();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const isProvider = user?.role === 'job_provider';
    const otherParty = isProvider ? conversation.seekerId : conversation.providerId;

    // Scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    // Load message history
    useEffect(() => {
        if (!conversation?._id) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/chat/conversations/${conversation._id}/messages`);
                setMessages(data);
                // Mark as read
                await api.post(`/chat/conversations/${conversation._id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                toast.error('Failed to load messages');
            } finally {
                setLoading(false);
                scrollToBottom();
            }
        };

        fetchMessages();
    }, [conversation._id]);

    // Socket.IO — join room and listen for messages
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !conversation?._id) return;

        socket.emit('join_room', conversation._id);

        const handleNewMessage = (msg) => {
            // Dedup strictly by server-assigned _id — no optimistic messages
            setMessages(prev => {
                const exists = prev.some(m => m._id === msg._id);
                return exists ? prev : [...prev, msg];
            });
            scrollToBottom();

            // Mark as read if it's from the other party
            const senderId = msg.senderId?._id || msg.senderId;
            const isMyMessage =
                senderId === user?._id ||
                senderId?.toString() === user?._id?.toString();
            if (!isMyMessage) {
                api.post(`/chat/conversations/${conversation._id}/read`).catch(() => {});
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.emit('leave_room', conversation._id);
        };
    }, [conversation._id, getSocket]);

    // Send message
    const handleSend = async () => {
        const content = input.trim();
        if (!content || sending) return;

        setSending(true);
        setInput('');

        const socket = getSocket();
        if (!socket) {
            toast.error('Connection lost. Please refresh.');
            setSending(false);
            return;
        }

        // Emit to server — the server echo via 'new_message' will add it to state
        socket.emit('send_message', {
            conversationId: conversation._id,
            senderId: user._id,
            content
        });

        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Group messages by date
    const grouped = messages.reduce((acc, msg) => {
        const dateKey = new Date(msg.createdAt).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(msg);
        return acc;
    }, {});

    const isMine = (msg) => {
        const sid = msg.senderId?._id || msg.senderId;
        return sid === user?._id || sid?.toString() === user?._id?.toString();
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-job-primary/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-job-primary/5 to-transparent">
                <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-10 h-10 bg-job-primary/10 rounded-xl flex items-center justify-center shrink-0 text-job-primary">
                        {otherParty?.profilePicture ? (
                            <img src={`http://localhost:5000/${otherParty.profilePicture}`} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-black text-job-dark text-sm truncate">{otherParty?.name}</p>
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {conversation.jobId?.title}
                            </span>
                            <span className="text-gray-200">·</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {conversation.jobId?.company}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-green-600">
                        <Wifi size={12} />
                        <span>Live</span>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6" style={{ minHeight: 0 }}>
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                        <div className="w-16 h-16 bg-job-primary/5 rounded-2xl flex items-center justify-center">
                            <Briefcase className="text-job-primary/40" size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-black text-gray-400">No messages yet</p>
                        <p className="text-xs font-bold text-gray-300 max-w-xs">
                            Start the conversation — discuss the role, next steps, or anything relevant.
                        </p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([dateKey, dayMessages]) => (
                        <div key={dateKey}>
                            {/* Date separator */}
                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-gray-100" />
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mx-4 whitespace-nowrap">
                                    {formatDate(dayMessages[0].createdAt)}
                                </span>
                                <div className="flex-grow border-t border-gray-100" />
                            </div>

                            {/* Messages */}
                            <div className="space-y-2">
                                {dayMessages.map((msg) => {
                                    const mine = isMine(msg);
                                    return (
                                        <div key={msg._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[72%] group`}>
                                                {/* Sender label — only show for received messages */}
                                                {!mine && (
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 pl-1">
                                                        {msg.senderId?.name}
                                                    </p>
                                                )}
                                                <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                                    mine
                                                        ? 'bg-job-primary text-white rounded-br-sm shadow-sm shadow-job-primary/20'
                                                        : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <p className={`text-[10px] font-bold text-gray-300 mt-1 ${mine ? 'text-right pr-1' : 'text-left pl-1'}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-end space-x-3">
                    <div className="flex-grow bg-white border-2 border-gray-100 focus-within:border-job-primary/40 rounded-2xl px-4 py-3 transition-all">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                            rows={1}
                            className="w-full bg-transparent text-sm text-gray-700 font-medium resize-none focus:outline-none placeholder:text-gray-300 leading-relaxed"
                            style={{ maxHeight: '100px', overflowY: 'auto' }}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            input.trim() && !sending
                                ? 'bg-job-primary text-white shadow-lg shadow-job-primary/30 hover:bg-job-primary/90 hover:-translate-y-0.5 active:scale-95'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] font-bold text-gray-300 text-center mt-2 uppercase tracking-widest">
                    Professional conversation · Job-scoped · Encrypted in transit
                </p>
            </div>
        </div>
    );
};

export default ChatWindow;
