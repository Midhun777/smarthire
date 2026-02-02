import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Users,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Calendar,
    MoreVertical,
    Search,
    UserCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? All associated data will be purged.')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User purged from system');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting user');
        }
    };

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await api.put(`/users/${user._id}/role`, { role: newRole });
            toast.success(`Access level updated to ${newRole.toUpperCase()}`);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating role');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Personnel Database</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-job-dark tracking-tighter">Personnel Directory</h2>
                    <p className="text-gray-500 font-medium mt-2 italic">Authorized access to the user registry.</p>
                </div>
                <div className="w-full md:w-80">
                    <Input
                        placeholder="SEARCH IDENTITIES..."
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
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Identified Entity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Permission Level</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry Date</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-job-primary/[0.02] transition-colors duration-300">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-xl bg-job-primary/10 border border-job-primary/5 flex items-center justify-center text-job-primary group-hover:scale-110 transition-transform">
                                                <UserCircle size={20} />
                                            </div>
                                            <span className="text-sm font-black text-job-dark tracking-tight">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-xs font-bold">
                                            <Mail size={14} className="mr-2 opacity-50" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <Badge variant={user.role === 'admin' ? 'primary' : 'gray'} className="px-3 py-1 font-black text-[10px] tracking-widest uppercase border-0">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center text-gray-400 text-xs font-bold">
                                            <Calendar size={14} className="mr-2 opacity-50" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest border-2 border-gray-100 hover:border-job-primary/20 hover:bg-job-primary/5 text-job-primary"
                                                onClick={() => toggleRole(user)}
                                                icon={user.role === 'admin' ? ShieldAlert : ShieldCheck}
                                            >
                                                Shift Role
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-100"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center">
                        <Users size={40} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No matching identities found</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminUsers;

