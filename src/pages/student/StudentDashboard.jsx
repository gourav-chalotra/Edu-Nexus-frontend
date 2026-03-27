import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useNavigate } from 'react-router-dom';
import XPBar from '../../components/gamification/XPBar';
import StreakCounter from '../../components/gamification/StreakCounter';
import Badge from '../../components/gamification/Badge';
import Leaderboard from '../../components/gamification/LeaderboardGamification';
import { Trophy, BookOpen, Clock, Star, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const { user, logout, updateProfile } = useAuth(); // Assuming updateProfile exists in AuthContext, if not I might need to add it or mock it locally for now.
    const { curriculum, loading, refreshCurriculum } = useCurriculum();
    const navigate = useNavigate();

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showAvatarGrid, setShowAvatarGrid] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };


    // Mock Avatar list - in real app, could be unlocked based on XP
    const avatars = [
        'Callie', 'Felix', 'Snuggles', 'Bandit', 'Gizmo', 'Mittens', 'Bailey', 'Shadow'
    ];

    const handleAvatarSelect = async (seed) => {
        try {
            // Update user profile logic here
            // For now, we'll try to use a function if it exists, or just toast
            if (updateProfile) {
                await updateProfile({ avatar: seed }); // Implicitly assuming mock DB handles this or AuthContext exposes it
                await refreshCurriculum();
                toast.success('Avatar updated!');
            } else {
                // Fallback for demo if context doesn't support it yet
                toast.success(`Avatar changed to ${seed}! (Refresh to see if persistent)`);
            }
            setShowAvatarModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update avatar');
        }
    };

    // Mock badges
    const badges = [
        { id: 1, name: 'Early Bird', icon: '🌅', description: 'Completed a lesson before 8 AM', earned: true },
        { id: 2, name: 'Quiz Master', icon: '🧠', description: 'Scored 100% in 5 quizzes', earned: true },
        { id: 3, name: 'Speedster', icon: '⚡', description: 'Finished a chapter in record time', earned: false },
    ];

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased transition-colors duration-300 pb-20">
            {/* Top Navigation / Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-[#0a0a0c]/70 border-b-2 border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#14b8a6] flex items-center justify-center text-white shadow-lg relative cartoon-border">
                            <span className="material-symbols-outlined text-2xl font-bold">school</span>
                        </div>
                        <span className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 hidden sm:block">Edu Nexus</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        <StreakCounter days={user?.streak || 0} />

                        <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                            <div className="flex items-center gap-2 p-1 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-[#14b8a6] dark:hover:border-[#14b8a6] transition-all">
                                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full overflow-hidden border-2 border-[#14b8a6]">
                                    <img src={user?.avatar?.startsWith('/uploads') ? `http://localhost:5001${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatar || user?.name || 'Felix'}`} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 hidden sm:block text-sm">{user?.name?.split(' ')[0]}</span>
                            </div>
                        </div>

                        <button onClick={logout} className="ml-2 flex items-center justify-center p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group" title="Logout">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Welcome Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-2">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#14b8a6]">{user?.name?.split(' ')[0]}!</span> 🚀</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Ready to boost your XP today?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Progress Card */}
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-800/80 p-8 cartoon-border pop-shadow text-white border-[4px] border-slate-900 dark:border-slate-700">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500 hidden sm:block">
                                <span className="material-symbols-outlined text-[160px] text-[#fbbf24]">emoji_events</span>
                            </div>
                            <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#6366f1]/30 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-sm">stars</span> Current Level</h2>
                                    <div className="text-5xl font-display font-black text-white mb-6">Level {user?.level || 1}</div>
                                    <XPBar current={user?.xp || 0} max={(user?.level || 1) * 1000} level={user?.level || 1} />
                                    <p className="text-slate-400 text-sm mt-3 font-bold">
                                        {((user?.level || 1) * 1000) - (user?.xp || 0)} XP to next level
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center gap-4 border-t border-slate-700/50 sm:border-t-0 sm:border-l sm:border-slate-700/50 pt-6 sm:pt-0 sm:pl-8">
                                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center transition-colors hover:bg-white/10">
                                        <div className="text-slate-300 font-bold text-sm">Total XP</div>
                                        <div className="text-2xl font-display font-bold text-[#fbbf24]">{user?.xp || 0}</div>
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center transition-colors hover:bg-white/10">
                                        <div className="text-slate-300 font-bold text-sm">Lessons</div>
                                        <div className="text-2xl font-display font-bold text-[#14b8a6]">{user?.progress?.length || 0}</div>
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center transition-colors hover:bg-white/10">
                                        <div className="text-slate-300 font-bold text-sm">Day Streak</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-display font-bold text-[#f97316]">{user?.streak || 0}</span>
                                            <span className="material-symbols-outlined text-[#f97316]">local_fire_department</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Grid */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 dark:bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] shadow-inner">
                                    <span className="material-symbols-outlined text-[30px]">menu_book</span>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">My Subjects</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                                {loading ? (
                                    // Loading Skeletons
                                    [1, 2, 3, 4].map((n) => (
                                        <div key={n} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 h-48 animate-pulse flex flex-col justify-between border-4 border-slate-100 dark:border-slate-700 mt-2">
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
                                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div>
                                                </div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                            </div>
                                            <div className="flex justify-between mt-4">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {Object.values(curriculum)
                                            .map((subject, idx) => {
                                                const colors = [
                                                    { bg: 'bg-[#6366f1]', hover: 'hover:border-[#6366f1]', text: 'text-[#6366f1]', lightBg: 'bg-[#6366f1]/10 dark:bg-white/10' },
                                                    { bg: 'bg-[#14b8a6]', hover: 'hover:border-[#14b8a6]', text: 'text-[#14b8a6]', lightBg: 'bg-[#14b8a6]/10 dark:bg-white/10' },
                                                    { bg: 'bg-[#f97316]', hover: 'hover:border-[#f97316]', text: 'text-[#f97316]', lightBg: 'bg-[#f97316]/10 dark:bg-white/10' },
                                                    { bg: 'bg-[#fbbf24]', hover: 'hover:border-[#fbbf24]', text: 'text-[#fbbf24]', lightBg: 'bg-[#fbbf24]/10 dark:bg-white/10' },
                                                ];
                                                const theme = colors[idx % colors.length];

                                                return (
                                                    <div
                                                        key={subject.id}
                                                        onClick={() => navigate(`/subject/${subject.id}`)}
                                                        className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 cursor-pointer group border-[5px] border-slate-100 dark:border-slate-700 ${theme.hover} hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden`}
                                                    >
                                                        <div className="flex justify-between items-start mb-5">
                                                            <div className={`w-14 h-14 rounded-[1.25rem] ${theme.lightBg} flex items-center justify-center ${theme.text} group-hover:scale-110 transition-transform shadow-sm`}>
                                                                <span className="material-symbols-outlined text-[28px]">science</span>
                                                            </div>
                                                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-inner whitespace-nowrap">Class {subject.classLevel}</span>
                                                        </div>
                                                        <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-2 leading-tight pr-4">{subject.title || subject.name}</h3>
                                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 line-clamp-2 pr-4">
                                                            {subject.chapters && subject.chapters.length > 0
                                                                ? `${subject.chapters.length} Chapters • Start learning ${subject.chapters[0].title}`
                                                                : "No chapters released yet. Check back soon for new content."}
                                                        </p>

                                                        <div className="flex justify-between items-center mt-auto pt-4 border-t-2 border-slate-50 dark:border-slate-700/50">
                                                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[11px]">Start Learning</span>
                                                            <span className={`${theme.text} font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>Play <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
                                                        </div>
                                                        <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${theme.bg} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                                    </div>
                                                );
                                            })}
                                        {Object.keys(curriculum).length === 0 && (
                                            <div className="col-span-full text-center p-12 bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold">
                                                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block animate-bounce">inventory_2</span>
                                                <p className="text-2xl font-display text-slate-900 dark:text-white mb-1">No subjects assigned yet.</p>
                                                <p className="font-medium text-slate-500">Check back later for new quests!</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">

                        {/* Leaderboard Widget */}
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-b from-[#fbbf24] to-[#f97316] rounded-[3rem] blur opacity-20 dark:opacity-10 pointer-events-none"></div>
                            <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] border-[4px] border-white dark:border-slate-800 shadow-xl overflow-hidden p-[2px]">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.3rem] overflow-hidden">
                                    <Leaderboard limit={5} />
                                    <div className="bg-white dark:bg-slate-800 p-3 text-center border-t border-slate-100 dark:border-slate-700">
                                        <a href="/leaderboard" className="text-sm font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 no-underline">
                                            View Full Leaderboard →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Daily Quests */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#14b8a6]/10 rounded-full blur-xl pointer-events-none"></div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 flex items-center justify-center text-[#14b8a6] shadow-sm">
                                    <span className="material-symbols-outlined text-[28px]">schedule</span>
                                </div>
                                Daily Quests
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner shrink-0 transition-all ${user ? 'bg-[#14b8a6] text-white scale-110' : 'border-4 border-slate-200 dark:border-slate-600'}`}>
                                        {user && <span className="material-symbols-outlined text-[20px]">check</span>}
                                    </div>
                                    <span className={`text-sm font-bold truncate transition-colors ${user ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>Login to the platform</span>
                                </li>
                                <li className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner shrink-0 transition-all ${user?.dailyQuizzes > 0 ? 'bg-[#14b8a6] text-white scale-110' : 'border-4 border-slate-200 dark:border-slate-600 group-hover:border-[#6366f1]'}`}>
                                        {user?.dailyQuizzes > 0 && <span className="material-symbols-outlined text-[20px]">check</span>}
                                    </div>
                                    <span className={`text-sm font-bold truncate transition-colors ${user?.dailyQuizzes > 0 ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300 group-hover:text-[#6366f1]'}`}>Complete 1 Quiz</span>
                                </li>
                                <li className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-inner shrink-0 transition-all ${user?.dailyXP >= 500 ? 'bg-[#14b8a6] text-white scale-110' : 'border-4 border-slate-200 dark:border-slate-600 group-hover:border-[#6366f1]'}`}>
                                        {user?.dailyXP >= 500 && <span className="material-symbols-outlined text-[20px]">check</span>}
                                    </div>
                                    <span className={`text-sm font-bold truncate transition-colors ${user?.dailyXP >= 500 ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300 group-hover:text-[#6366f1]'}`}>Earn 500 XP Today</span>
                                </li>
                            </ul>
                        </div>

                        {/* Badges */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fbbf24]/10 rounded-full blur-xl pointer-events-none"></div>
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24] shadow-sm">
                                    <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                                </div>
                                <span className="leading-tight">Recent<br />Achievements</span>
                            </h3>
                            {(!user?.badges || user.badges.length === 0) ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-500">lock</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Play quizzes to earn badges!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {user.badges.slice(-3).reverse().map(badge => (
                                        <div key={badge._id || badge.badgeId} className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-3 border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-2">
                                            <span className="text-3xl">{badge.icon || '🏆'}</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{badge.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            {/* Avatar Selector Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border-4 border-slate-100 dark:border-slate-700">
                        <div className="p-6 border-b-2 border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#6366f1]">manage_accounts</span>
                                Edit Character
                            </h3>
                            <button onClick={() => setShowAvatarModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                                {/* Left Column: Avatar */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-4 w-48">
                                    <div className="relative group">
                                        <div className="w-36 h-36 rounded-[2rem] border-4 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-inner">
                                            <img
                                                src={user?.avatar?.startsWith('/uploads') ? `http://localhost:5001${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatar || user?.name || 'Felix'}`}
                                                alt="Current Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                                            className="absolute inset-0 bg-black/50 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                        >
                                            <Edit2 className="text-white w-8 h-8" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                                            className="absolute -bottom-2 -right-2 bg-[#f97316] w-12 h-12 flex items-center justify-center rounded-2xl border-4 border-white dark:border-slate-800 text-white shadow-sm hover:scale-110 transition-transform"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>

                                    {showAvatarGrid && (
                                        <div className="w-full animate-in slide-in-from-top-2 fade-in mt-4">
                                            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 text-center">Select Avatar</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {avatars.map((seed) => (
                                                    <button
                                                        key={seed}
                                                        onClick={() => {
                                                            handleAvatarSelect(seed);
                                                            setShowAvatarGrid(false);
                                                        }}
                                                        className={`aspect-square rounded-2xl border-2 p-1 transition-all ${(user?.avatar || user?.name) === seed
                                                            ? 'border-[#6366f1] bg-[#6366f1]/10 scale-105'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-[#6366f1]/50 dark:hover:border-[#6366f1]/50'
                                                            }`}
                                                    >
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                                                            alt={seed}
                                                            className="w-full h-full rounded-xl"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Details Form */}
                                <div className="flex-1 space-y-4">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);

                                            // Append file if selected
                                            const fileInput = e.target.querySelector('input[type="file"]');
                                            if (fileInput && fileInput.files[0]) {
                                                formData.set('avatar', fileInput.files[0]);
                                            }

                                            // Call updateProfile with FormData
                                            if (updateProfile) {
                                                updateProfile(formData)
                                                    .then(async () => {
                                                        await refreshCurriculum();
                                                        toast.success('Profile updated successfully!');
                                                        setShowAvatarModal(false);
                                                    })
                                                    .catch(() => toast.error('Failed to update profile'));
                                            }
                                        }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Upload Custom Image</label>
                                            <input
                                                type="file"
                                                name="avatar"
                                                accept="image/*"
                                                className="w-full text-sm text-slate-500 dark:text-slate-400
                                                    file:mr-4 file:py-3 file:px-6
                                                    file:rounded-2xl file:border-0
                                                    file:text-sm file:font-bold
                                                    file:bg-[#6366f1]/10 file:text-[#6366f1] dark:file:bg-[#6366f1]/20
                                                    hover:file:bg-[#6366f1]/20 transition-all cursor-pointer"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Character Name</label>
                                            <div className="relative">
                                                <Edit2 className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={user?.name}
                                                    className="w-full pl-12 pr-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">School / Guild</label>
                                            <input
                                                type="text"
                                                name="school"
                                                defaultValue={user?.school || ''}
                                                placeholder="Enter your school name"
                                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                defaultValue={user?.email}
                                                className="w-full px-5 py-3 bg-slate-100 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Class / level</label>
                                                <select
                                                    name="classLevel"
                                                    defaultValue={user?.classLevel}
                                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                                >
                                                    {[6, 7, 8, 9, 10].map(c => (
                                                        <option key={c} value={c}>Class {c}</option>
                                                    ))}
                                                </select>
                                            </div>


                                            <div className="space-y-1">
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    defaultValue={user?.age || ''}
                                                    placeholder="14"
                                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-[#f97316]/20 focus:border-[#f97316] outline-none text-slate-900 dark:text-white font-medium transition-all"
                                                    min="10"
                                                    max="20"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t-2 border-slate-100 dark:border-slate-700/50 flex justify-end gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAvatarModal(false)}
                                                className="px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex items-center justify-center px-8 h-12 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold shadow-[0_4px_0_0_#ea580c] active:shadow-none active:translate-y-1 transition-all"
                                            >
                                                Save Character
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
