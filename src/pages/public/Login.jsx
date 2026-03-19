import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, GraduationCap, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const redirectPath = user.role === 'admin' ? '/admin'
                : user.role === 'teacher' ? '/teacher'
                    : '/dashboard';
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            // Redirect based on user role
            const redirectPath = userData.role === 'admin' ? '/admin'
                : userData.role === 'teacher' ? '/teacher'
                    : '/dashboard';
            navigate(redirectPath, { replace: true });
        } catch (error) {
            // Error toast is already shown in AuthContext
            console.error('Login error:', error);
        }
    };

    const setDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('password123');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 font-quicksand transition-colors duration-300 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#14b8a6]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow relative z-10 flex flex-col items-center">

                {/* Header Icon */}
                <div className="bg-[#6366f1] p-4 rounded-2xl shadow-inner border-[3px] border-[#4f46e5] mb-6 inline-flex">
                    <LogIn className="block w-8 h-8 text-white drop-shadow-sm" strokeWidth={2.5} />
                </div>

                <h2 className="text-3xl font-display font-black text-center text-slate-800 dark:text-white mb-2 tracking-wide">Welcome Back!</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 font-bold mb-8">Ready for some learning?</p>

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Email / Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-inner outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                placeholder="student@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-inner outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#10b981] text-white py-4 rounded-xl font-black text-lg border-b-[5px] border-[#059669] active:border-b-0 active:translate-y-[5px] transition-all hover:bg-[#059669] flex justify-center items-center gap-2 group mt-8 shadow-sm">
                        <span>Let's Go!</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                </form>

                {/* Demo Accounts */}
                <div className="w-full mt-8 pt-6 border-t-[3px] border-slate-200 dark:border-slate-700 border-dashed">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Demo Access (Click to Fill)</p>
                    <div className="grid grid-cols-1 gap-3 w-full">
                        <button type="button" onClick={() => setDemo('student@demo.com')} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-colors group">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                <GraduationCap className="w-4 h-4 text-[#3b82f6]" /> Student
                            </div>
                            <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 group-hover:border-[#3b82f6]/50 transition-colors">student@demo.com</code>
                        </button>
                        <button type="button" onClick={() => setDemo('teacher@demo.com')} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-colors group">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                <GraduationCap className="w-4 h-4 text-[#f59e0b]" /> Teacher
                            </div>
                            <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 group-hover:border-[#f59e0b]/50 transition-colors">teacher@demo.com</code>
                        </button>
                        <button type="button" onClick={() => setDemo('admin@edu.nexus')} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 transition-colors group">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                                <ShieldAlert className="w-4 h-4 text-[#ef4444]" /> Admin
                            </div>
                            <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 group-hover:border-[#ef4444]/50 transition-colors">admin@edu.nexus</code>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
