import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        classLevel: '10', // Default
        role: 'student'
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Account created!');
            navigate('/dashboard');
        } catch {
            // Error handled in context
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased transition-colors duration-300 relative overflow-hidden py-12">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#fbbf24]/20 dark:bg-[#fbbf24]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#f97316]/20 dark:bg-[#f97316]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md perspective-1000">
                <div className="floating-card bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 cartoon-border pop-shadow mx-4">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#fbbf24] to-[#f97316] flex items-center justify-center text-white shadow-lg animate-bounce duration-1000">
                            <span className="material-symbols-outlined text-4xl">person_add</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-display font-bold text-center mb-2 text-slate-900 dark:text-white">Join Edu Nexus</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 font-medium mb-8">Start your gamified learning journey today.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] dark:focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] dark:focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                placeholder="student@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] dark:focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Class Selection */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Class / Grade</label>
                            <div className="relative">
                                <select
                                    value={formData.classLevel}
                                    onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] dark:focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium appearance-none transition-all cursor-pointer"
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                >
                                    <option value="6">Class 6 - Beginner</option>
                                    <option value="7">Class 7 - Novice</option>
                                    <option value="8">Class 8 - Intermediate</option>
                                    <option value="9">Class 9 - Advanced</option>
                                    <option value="10">Class 10 - Expert</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                                    <span className="material-symbols-outlined">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <input type="hidden" value="student" />
                        <div className="pt-4">
                            <button type="submit" className="w-full flex items-center justify-center px-6 h-14 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white text-lg font-bold shadow-[0_6px_0_0_#ea580c] active:shadow-none active:translate-y-[6px] transition-all group">
                                <span>Create Character</span>
                                <span className="material-symbols-outlined ml-2 group-hover:block transition-transform">swords</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-700/50 text-center">
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Already playing? <Link to="/login" className="text-[#f97316] hover:text-[#ea580c] font-bold transition-colors">Log In Here</Link>
                        </p>
                    </div>
                </div>

                {/* Decorative floating elements */}
                <div className="hidden sm:flex absolute -left-12 -top-4 w-20 h-20 bg-[#6366f1] rounded-3xl items-center justify-center shadow-xl transform -rotate-12 border-4 border-white dark:border-[#0a0a0c] animate-pulse pointer-events-none">
                    <span className="material-symbols-outlined text-white text-3xl">sports_esports</span>
                </div>
                <div className="hidden sm:flex absolute -right-10 bottom-24 w-16 h-16 bg-[#14b8a6] rounded-full items-center justify-center shadow-xl transform rotate-12 border-4 border-white dark:border-[#0a0a0c] pointer-events-none">
                    <span className="material-symbols-outlined text-white text-2xl">local_fire_department</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
