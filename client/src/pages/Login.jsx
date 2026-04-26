import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            toast.success('Welcome back!');
            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'job_provider') {
                navigate('/provider-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
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
                        <Link to="/" className="inline-block mb-6 group">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-job-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden border border-gray-100">
                                <img src={logo} alt="SmartHire Logo" className="w-full h-full object-contain p-2" />
                            </div>
                        </Link>
                        <h2 className="text-3xl font-black text-job-dark tracking-tight">Login</h2>
                        <p className="text-gray-500 mt-2 font-medium">Welcome back to SmartHire</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            className="w-full"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/40">
                        <p className="text-sm text-gray-600 font-medium">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-job-primary font-bold hover:underline transition-all"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Login;

