import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socketRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch unread count from REST
    const refreshUnread = async () => {
        if (!user) return;
        try {
            const { data } = await api.get('/chat/unread');
            setUnreadCount(data.unread || 0);
        } catch {
            // silent fail
        }
    };

    useEffect(() => {
        if (!user) {
            // Disconnect if logged out
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
                setUnreadCount(0);
            }
            return;
        }

        // Connect socket with userId in query
        const socket = io('http://localhost:5000', {
            query: { userId: user._id },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('[Chat] Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('[Chat] Socket disconnected');
        });

        // When the other party sends a message, increment unread
        socket.on('unread_update', () => {
            setUnreadCount(prev => prev + 1);
        });

        // Initial unread fetch
        refreshUnread();

        // Polling every 30s as fallback
        const pollInterval = setInterval(refreshUnread, 30000);

        return () => {
            socket.disconnect();
            clearInterval(pollInterval);
        };
    }, [user?._id]);

    const getSocket = () => socketRef.current;

    return (
        <ChatContext.Provider value={{ getSocket, unreadCount, setUnreadCount, refreshUnread, isConnected }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);

export default ChatContext;
