import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-job-neutral to-white/50 p-4">
            <Card className="w-full max-w-md p-8 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-job-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-job-secondary/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-job-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-job-secondary/20">
                            <UserPlus className="text-job-secondary w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-job-dark tracking-tight">Sign Up</h2>
                        <p className="text-gray-500 mt-2 font-medium">Join us and find your dream job</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            icon={User}
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full"
                            loading={loading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/40">
                        <p className="text-sm text-gray-600 font-medium">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-job-secondary font-bold hover:underline transition-all"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Signup;

