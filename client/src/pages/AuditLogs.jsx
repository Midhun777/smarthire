import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    ClipboardList,
    Search,
    Info,
    Clock,
    User,
    Globe,
    Activity,
    Shield,
    Database,
    Zap,
    ChevronRight,
    Filter
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/audit');
                setLogs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching audit logs:', error);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user && log.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getActionBadgeVariant = (action) => {
        if (action.includes('Login')) return 'primary';
        if (action.includes('Created')) return 'success';
        if (action.includes('Deleted')) return 'danger';
        if (action.includes('Updated')) return 'warning';
        return 'gray';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Decrypting Security Archives</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-job-dark tracking-tighter">Security Ledger</h2>
                    <p className="text-gray-500 font-medium mt-2 italic">Immutable record of all high-level system operations.</p>
                </div>
                <div className="w-full md:w-96">
                    <Input
                        placeholder="SEARCH EVENT LOGS..."
                        icon={Search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 border-white/60 shadow-xl shadow-job-primary/5"
                    />
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-white/60 shadow-2xl shadow-job-primary/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-job-neutral/30">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Chronology</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Acting Agent</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Entity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Origin Node</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/50">
                            {filteredLogs.map((log) => (
                                <tr key={log._id} className="group hover:bg-job-primary/[0.02] transition-colors duration-300">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm group-hover:text-job-primary transition-colors">
                                                <Clock size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-job-dark tracking-tight">
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase">
                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-job-neutral flex items-center justify-center text-job-dark font-black text-xs border border-white shadow-inner">
                                                {log.user ? log.user.name.charAt(0) : 'S'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-job-dark tracking-tight">
                                                    {log.user ? log.user.name : 'SYSTEM CORE'}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">
                                                    {log.user ? log.user.email : 'AUTO_PROC_V1'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <Badge variant={getActionBadgeVariant(log.action)} className="px-3 py-1 font-black text-[10px] tracking-widest uppercase border-0">
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-job-neutral/50 flex items-center justify-center text-gray-500">
                                                <Database size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-job-dark tracking-tight uppercase">{log.entityType}</div>
                                                <div className="text-[10px] font-mono text-gray-400">
                                                    ID: {log.entityId ? log.entityId.substring(0, 8) : 'ROOT'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-[10px] font-mono font-bold tracking-wider">
                                            <Globe size={14} className="mr-2 opacity-50" />
                                            {log.ipAddress || 'INTERNAL'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredLogs.length === 0 && (
                    <div className="py-20 text-center">
                        <Shield size={40} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No anomalies detected</p>
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-between p-8 bg-job-neutral/30 rounded-3xl border border-white/60">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-job-primary shadow-sm border border-white">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-job-dark uppercase tracking-tight">Log Retention Policy</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data archived every 30 terrestrial days</p>
                    </div>
                </div>
                <Button variant="ghost" className="h-12 border-2 border-gray-100 hover:border-job-primary/20 hover:bg-white text-[10px] font-black uppercase tracking-widest">
                    Export Archive
                </Button>
            </div>
        </div>
    );
};

export default AuditLogs;

