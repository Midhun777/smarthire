import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { LayoutDashboard, ClipboardList, User, LogOut, Shield, BriefcaseBusiness, Sparkles, Kanban, MessageSquare } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { unreadCount } = useChat();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-job-primary rounded-xl flex items-center justify-center shadow-lg shadow-job-primary/20 group-hover:scale-110 transition-all">
                                <BriefcaseBusiness className="text-white w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-job-primary to-job-secondary">
                                SmartHire
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-xl">
                                    {(user.role === 'job_seeker' || user.role === 'user' || user.role === 'admin') && (
                                        <>
                                            <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={18} />}>
                                                Dashboard
                                            </NavLink>
                                            <NavLink to="/discovery" active={isActive('/discovery')} icon={<Sparkles size={18} className="text-amber-500" />}>
                                                Discover
                                            </NavLink>
                                            <NavLink to="/applications" active={isActive('/applications')} icon={<Kanban size={18} />}>
                                                My Board
                                            </NavLink>
                                        </>
                                    )}
                                    {(user.role === 'job_provider' || user.role === 'admin') && (
                                        <NavLink to="/provider-dashboard" active={isActive('/provider-dashboard')} icon={<BriefcaseBusiness size={18} />}>
                                            Provider Portal
                                        </NavLink>
                                    )}
                                </div>

                                <div className="flex items-center space-x-1 md:space-x-2 bg-gray-100/50 p-1 rounded-2xl">
                                    {/* Messages with unread badge */}
                                    <Link
                                        to="/chat"
                                        className={`relative p-2 rounded-xl transition-all ${isActive('/chat') ? 'bg-white text-job-primary shadow-sm' : 'text-gray-500 hover:text-job-dark hover:bg-white/50'}`}
                                        title="Messages"
                                    >
                                        <MessageSquare size={18} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-job-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                    
                                    <NotificationDropdown />
                                    
                                    <Link
                                        to="/profile"
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${isActive('/profile') ? 'bg-white text-job-primary shadow-sm' : 'text-gray-500 hover:text-job-dark hover:bg-white/50'}`}
                                        title="My Profile"
                                    >
                                        {user?.profilePicture ? (
                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white shadow-sm ring-2 ring-job-primary/5">
                                                <img
                                                    src={`http://localhost:5000/${user.profilePicture}`}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <User size={18} />
                                        )}
                                        <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Profile</span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className={`p-2 rounded-xl transition-all ${isActive('/settings') ? 'bg-white text-job-primary shadow-sm' : 'text-gray-500 hover:text-job-dark hover:bg-white/50'}`}
                                        title="Account Settings"
                                    >
                                        <Shield size={18} />
                                    </Link>
                                </div>

                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${isActive('/admin') ? 'bg-job-secondary/10 text-job-secondary' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title="Admin Dashboard"
                                    >
                                        <Shield size={20} />
                                        <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Admin Panel</span>
                                    </Link>
                                )}

                                {(user.role === 'job_provider' || user.role === 'admin') && (
                                    <div className="md:hidden">
                                        <Link
                                            to="/provider-dashboard"
                                            className={`p-2 rounded-xl transition-all ${isActive('/provider-dashboard') ? 'bg-amber-100/50 text-amber-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                            title="Provider Portal"
                                        >
                                            <BriefcaseBusiness size={24} />
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="ml-2 flex items-center space-x-2 bg-job-dark/5 hover:bg-red-50 hover:text-red-600 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-job-primary px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-job-primary hover:bg-job-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-job-primary/20 transition-all hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

const NavLink = ({ to, active, icon, children }) => (
    <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active
            ? 'bg-white text-job-primary shadow-sm'
            : 'text-gray-500 hover:text-job-dark hover:bg-white/50'
            }`}
    >
        {icon}
        <span>{children}</span>
    </Link>
);

export default Navbar;

