import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    ChevronRight,
    ClipboardList,
    ShieldAlert,
    Cpu,
    Activity,
    LogOut
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, jobs: 0 });
    const location = useLocation();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, jobsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/jobs')
                ]);
                setStats({
                    users: usersRes.data.length,
                    jobs: jobsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const navItems = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
        { name: 'Audit Logs', path: '/admin/audit', icon: ClipboardList },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-10 px-4 py-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
                <Card className="p-0 overflow-hidden sticky top-28 border-white/40 shadow-2xl shadow-job-primary/5">
                    {/* Header */}
                    <div className="p-8 border-b border-white/40 bg-job-neutral/50">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-job-primary/10 rounded-xl flex items-center justify-center text-job-primary shadow-inner">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-job-dark tracking-tighter">Command Unit</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrative Layer</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path === '/admin' && location.pathname === '/admin/');
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 group ${isActive
                                        ? 'bg-job-primary text-white shadow-xl shadow-job-primary/30'
                                        : 'text-gray-500 hover:bg-job-primary/5 hover:text-job-primary'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <item.icon className={`h-5 w-5 mr-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.name}
                                    </div>
                                    {isActive && <ChevronRight className="h-4 w-4 animate-in fade-in slide-in-from-left-2" />}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-8 p-8 border-t border-white/40 bg-job-neutral/30">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-2">System Telemetry</h3>
                        <div className="space-y-4">
                            <TelemetryItem label="Node Status" value="Active" icon={Activity} color="text-green-500" />
                            <TelemetryItem label="CPU Load" value="2.4%" icon={Cpu} color="text-job-primary" />
                            <div className="pt-4 border-t border-white/40 flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Jobs</span>
                                <Badge variant="primary" className="h-6 px-3">{stats.jobs}</Badge>
                            </div>
                        </div>
                    </div>
                </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-grow min-w-0">
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const TelemetryItem = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center justify-between px-2 group">
        <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-white border border-white/60 rounded-lg flex items-center justify-center shadow-sm ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={14} />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{value}</span>
    </div>
);

export default AdminDashboard;

