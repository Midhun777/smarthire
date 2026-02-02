import React, { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    ArrowUpRight,
    Clock,
    MapPin,
    Building2,
    Activity,
    Target,
    Zap,
    ChevronRight,
    Search
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        applications: 0,
        recentApps: [],
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/applications/stats');
            setStats(data);
        } catch (error) {
            toast.error('Error fetching dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Data stream</p>
        </div>
    );

    const cards = [
        { title: 'Registered Talent', value: stats.users, icon: Users, color: 'text-job-primary', bg: 'bg-job-primary/10', trend: '+12.5%' },
        { title: 'Mission Postings', value: stats.jobs, icon: Briefcase, color: 'text-job-secondary', bg: 'bg-job-secondary/10', trend: '+5.2%' },
        { title: 'Global Submissions', value: stats.applications, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18.1%' },
        { title: 'Conversion Rate', value: '64.2%', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+2.4%' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-dark tracking-tighter">System Pulse</h1>
                    <p className="text-gray-500 font-medium text-lg mt-2 italic">Real-time oversight of the Job AI ecosystem.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
                    <span className="text-[10px] font-black text-dark uppercase tracking-widest pr-4">Live Updates Enabled</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <Card key={index} className="p-8 border-white/60 shadow-xl shadow-job-primary/5 group hover:border-job-primary/20 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                                <card.icon size={22} />
                            </div>
                            <Badge variant="success" className="bg-green-500 text-white border-0 text-[10px] py-1 px-3">
                                {card.trend}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                            <h3 className="text-3xl font-black text-dark tracking-tighter">{card.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <Card className="lg:col-span-2 p-10 border-white/60 shadow-2xl shadow-job-primary/5">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-job-dark underline decoration-job-primary/30 underline-offset-8">Engagement Flux</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">7 Day Application Velocity</p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-6">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-job-primary rounded-full mr-2"></span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployments</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--job-primary)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--job-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--job-neutral)', textTransform: 'uppercase' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--job-neutral)' }}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--job-primary)', strokeWidth: 2 }}
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--job-dark)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="apps"
                                    stroke="var(--job-primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorApps)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-8 border-white/60 shadow-2xl shadow-job-primary/5 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-job-dark tracking-tighter">Recent Ops</h3>
                        <Badge variant="gray" className="text-[10px] font-black">LIVE</Badge>
                    </div>

                    <div className="space-y-8 flex-grow">
                        {stats.recentApps.length > 0 ? stats.recentApps.map((app) => (
                            <div key={app._id} className="flex space-x-4 group cursor-pointer">
                                <div className="relative shrink-0">
                                    <div className="h-12 w-12 rounded-2xl bg-job-neutral border border-white shadow-sm flex items-center justify-center text-job-primary group-hover:bg-job-primary group-hover:text-white transition-all duration-300">
                                        <Users size={20} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-black text-job-dark truncate tracking-tight group-hover:text-job-primary transition-colors">
                                        {app.user?.name || 'Anonymous User'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-widest mt-1">
                                        Applied: <span className="text-job-primary">{app.job?.title || 'System Core'}</span>
                                    </p>
                                    <div className="flex items-center mt-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        <Clock size={10} className="mr-1" />
                                        {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <div className="shrink-0 pt-1">
                                    <Badge variant={app.status === 'Accepted' ? 'success' : app.status === 'Rejected' ? 'danger' : 'gray'} className="text-[8px] py-1 px-2 border-0 uppercase font-black">
                                        {app.status}
                                    </Badge>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <Activity size={40} className="text-gray-100 mb-4" />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Recent Signals</p>
                            </div>
                        )}
                    </div>

                    <Button variant="ghost" className="w-full mt-10 h-14 border-2 border-job-primary/5 hover:border-job-primary/20 hover:bg-job-primary/5 text-job-primary font-black uppercase tracking-widest text-[10px]" icon={ChevronRight}>
                        Full Activity Log
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminOverview;

