import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, ClipboardList, User, LogOut, Shield, BriefcaseBusiness } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
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
                                JobAI
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-xl">
                                    <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={18} />}>
                                        Dashboard
                                    </NavLink>
                                    <NavLink to="/applications" active={isActive('/applications')} icon={<ClipboardList size={18} />}>
                                        Applications
                                    </NavLink>
                                </div>

                                <Link
                                    to="/profile"
                                    className={`p-2 rounded-xl transition-all ${isActive('/profile') ? 'bg-job-primary/10 text-job-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="Profile"
                                >
                                    <User size={24} />
                                </Link>

                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className={`p-2 rounded-xl transition-all ${isActive('/admin') ? 'bg-job-secondary/10 text-job-secondary' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title="Admin Dashboard"
                                    >
                                        <Shield size={24} />
                                    </Link>
                                )}

                                {(user.role === 'job_provider' || user.role === 'admin') && (
                                    <Link
                                        to="/provider-dashboard"
                                        className={`p-2 rounded-xl transition-all ${isActive('/provider-dashboard') ? 'bg-amber-100/50 text-amber-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                        title="Provider Portal"
                                    >
                                        <BriefcaseBusiness size={24} />
                                    </Link>
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
        </nav>
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

