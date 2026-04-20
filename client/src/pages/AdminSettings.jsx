import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
    Settings,
    Mail,
    AlertCircle,
    Save,
    Shield,
    HardDrive,
    Lock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        supportEmail: '',
        maintenanceMode: false,
        systemAlert: '',
        allowedFileTypes: ['pdf'],
        maxFileSize: 5242880
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/admin/settings');
                setSettings(data);
            } catch (error) {
                toast.error('Error fetching settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            toast.success('System settings updated');
        } catch (error) {
            toast.error('Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="w-10 h-10 border-4 border-job-primary/20 border-t-job-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Global Config</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
            <div>
                <h2 className="text-3xl font-black text-job-dark tracking-tighter">System Configuration</h2>
                <p className="text-gray-500 font-medium mt-2 italic">Global parameters for the SmartHire platform.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* General Settings */}
                <Card className="p-8 border-white/60 shadow-2xl shadow-job-primary/5">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-job-primary/10 flex items-center justify-center text-job-primary">
                            <Settings size={20} />
                        </div>
                        <h3 className="text-lg font-black text-job-dark tracking-tight">Platform Identity</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="Support Contact Email"
                            icon={Mail}
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            placeholder="support@smarthire.com"
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Maintenance Mode</label>
                            <div className="flex items-center mt-2 p-1 bg-gray-100 rounded-2xl w-fit">
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, maintenanceMode: false })}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!settings.maintenanceMode ? 'bg-white text-job-primary shadow-sm' : 'text-gray-400'}`}
                                >
                                    Online
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, maintenanceMode: true })}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.maintenanceMode ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'text-gray-400'}`}
                                >
                                    Maintenance
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Communication */}
                <Card className="p-8 border-white/60 shadow-2xl shadow-job-primary/5">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="text-lg font-black text-job-dark tracking-tight">System Broadcast</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Alert Message (Dynamic Banner)</label>
                        <textarea
                            rows={3}
                            placeholder="Enter a message to display for all users..."
                            className="w-full bg-white/50 border border-white/60 rounded-2xl p-4 text-sm font-medium text-job-dark focus:ring-2 focus:ring-job-primary/20 focus:border-job-primary transition-all outline-none resize-none placeholder:text-gray-300"
                            value={settings.systemAlert}
                            onChange={(e) => setSettings({ ...settings, systemAlert: e.target.value })}
                        />
                    </div>
                </Card>

                {/* Storage & Security */}
                <Card className="p-8 border-white/60 shadow-2xl shadow-job-primary/5 opacity-60">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                                <HardDrive size={20} />
                            </div>
                            <h3 className="text-lg font-black text-job-dark tracking-tight text-gray-400 italic">Advanced Storage (Read-Only)</h3>
                        </div>
                        <Lock size={16} className="text-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Allowed File Types</label>
                            <div className="p-4 bg-gray-50 rounded-xl text-xs font-mono font-bold text-gray-500">
                                {settings.allowedFileTypes.join(', ')}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Max Upload Size</label>
                            <div className="p-4 bg-gray-50 rounded-xl text-xs font-mono font-bold text-gray-500">
                                {(settings.maxFileSize / (1024 * 1024)).toFixed(1)} MB
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        loading={saving}
                        icon={Save}
                        className="px-10 py-4 shadow-xl shadow-job-primary/20"
                    >
                        Save Configuration
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
