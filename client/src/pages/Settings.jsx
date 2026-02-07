import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Shield, Lock, Save, ChevronLeft, Camera } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Settings = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/users/profile', profileData);
            // Update auth context with new info
            login({ ...user, ...data });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            await api.put('/users/profile/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            const { data } = await api.post('/users/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Profile photo updated');
            login({ ...user, profilePicture: data.profilePicture });
        } catch (error) {
            toast.error('Failed to upload photo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
            <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-gray-500 hover:text-job-primary font-bold transition-colors mb-4"
            >
                <ChevronLeft size={20} />
                <span>Return to Profile</span>
            </button>

            <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-job-primary/10 rounded-2xl flex items-center justify-center text-job-primary border border-job-primary/20">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-job-dark tracking-tight">Account System</h1>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Manage Profile & Security</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-job-dark flex items-center">
                        <User size={20} className="mr-3 text-job-primary" />
                        Identity Calibration
                    </h2>
                    <Card className="p-8 border-white/40 shadow-xl shadow-job-primary/5">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl bg-job-primary/5 flex items-center justify-center text-job-primary overflow-hidden border-2 border-white shadow-lg">
                                    {user?.profilePicture ? (
                                        <img
                                            src={`http://localhost:5000/${user.profilePicture}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={40} strokeWidth={1.5} />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-job-primary text-white rounded-lg flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={loading} />
                                    <Camera size={14} />
                                </label>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Visual Identity</p>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <Input
                                label="Full Identity Name"
                                icon={User}
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Communication Channel (Email)"
                                icon={Mail}
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Contact Number"
                                icon={Phone}
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                            <Input
                                label="Geo-Location"
                                icon={MapPin}
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                placeholder="e.g. Kochi, Kerala"
                            />
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Professional Abstract (Bio)</label>
                                <textarea
                                    className="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-4 text-sm font-semibold text-job-dark placeholder:text-gray-300 focus:ring-4 focus:ring-job-primary/10 focus:border-job-primary outline-none min-h-[120px]"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    placeholder="Briefly describe your professional trajectory..."
                                />
                            </div>
                            <Button type="submit" className="w-full" loading={loading} icon={Save}>
                                Deploy Changes
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Security / Password */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-job-dark flex items-center">
                        <Lock size={20} className="mr-3 text-job-secondary" />
                        Security Protocols
                    </h2>
                    <Card className="p-8 border-white/40 shadow-xl shadow-job-secondary/5">
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <Input
                                label="Current Access Key"
                                icon={Lock}
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                            <div className="h-px bg-gray-100" />
                            <Input
                                label="New Access Key"
                                icon={Shield}
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                            />
                            <Input
                                label="Verify New Key"
                                icon={Shield}
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                            />
                            <Button type="submit" variant="secondary" className="w-full" loading={loading} icon={Save}>
                                Update Credentials
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
