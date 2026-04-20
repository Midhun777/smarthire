import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, Info, X } from 'lucide-react';

const SystemBanner = () => {
    const [settings, setSettings] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchPublicSettings = async () => {
            try {
                const { data } = await api.get('/admin/public-settings');
                setSettings(data);
            } catch (error) {
                console.error('Error fetching system banner settings:', error);
            }
        };
        fetchPublicSettings();

        // Refresh every 5 minutes
        const interval = setInterval(fetchPublicSettings, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!settings || !visible) return null;

    const showMaintenance = settings.maintenanceMode;
    const showAlert = settings.systemAlert && settings.systemAlert.trim() !== '';

    if (!showMaintenance && !showAlert) return null;

    return (
        <div className="w-full animate-in slide-in-from-top duration-500 z-[100]">
            {showMaintenance && (
                <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center space-x-3 text-sm font-black uppercase tracking-widest shadow-lg">
                    <AlertTriangle size={18} className="animate-pulse" />
                    <span>System Maintenance in Progress: Some features may be limited</span>
                </div>
            )}
            {showAlert && !showMaintenance && (
                <div className="bg-job-primary text-white px-4 py-2 flex items-center justify-between shadow-md">
                    <div className="flex-grow flex items-center justify-center space-x-3">
                        <Info size={16} />
                        <span className="text-xs font-bold tracking-tight">{settings.systemAlert}</span>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SystemBanner;
