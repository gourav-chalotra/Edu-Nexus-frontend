import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
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

    return (
        <div className="bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased overflow-x-hidden transition-colors duration-300">
            {/* Landing page generated from Stitch UI */}

            <div className="relative flex min-h-screen w-full flex-col">
                <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-[#0a0a0c]/70 border-b-2 border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#14b8a6] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <span className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Edu Nexus</span>
                            </div>
                            <nav className="hidden md:flex items-center gap-10">
                                <a className="text-sm font-bold text-slate-600 hover:text-[#6366f1] dark:text-slate-300 dark:hover:text-white transition-colors" href="#">Courses</a>
                                <a className="text-sm font-bold text-slate-600 hover:text-[#6366f1] dark:text-slate-300 dark:hover:text-white transition-colors" href="#">Features</a>
                                <a className="text-sm font-bold text-slate-600 hover:text-[#6366f1] dark:text-slate-300 dark:hover:text-white transition-colors" href="#">Pricing</a>
                            </nav>
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
                                <Link to="/login" className="hidden sm:flex items-center justify-center px-4 h-10 text-sm font-bold text-slate-700 hover:text-[#6366f1] dark:text-slate-300 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="flex items-center justify-center px-6 h-11 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-bold shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow">
                    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
                        <div className="bubbly-bg">
                            <div className="bubble bg-[#6366f1] w-[500px] h-[500px] top-[-10%] right-[-5%]"></div>
                            <div className="bubble bg-[#14b8a6] w-[400px] h-[400px] bottom-[-10%] left-[-5%]"></div>
                            <div className="bubble bg-[#fbbf24] w-[300px] h-[300px] top-[20%] left-[10%]"></div>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div className="max-w-2xl relative z-10">
                                    <h1 className="text-6xl lg:text-8xl font-display font-bold leading-[1] mb-8 text-slate-900 dark:text-white">
                                        Make Learning <br />
                                        <span className="stitch-text-gradient">Addictive</span>
                                    </h1>
                                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
                                        Master new skills with the platform that turns studying into a game. Join 50,000+ students leveling up their careers today.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        <Link to="/register" className="inline-flex items-center justify-center px-10 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#14b8a6] text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
                                            Start Learning Free
                                        </Link>
                                        <button className="inline-flex items-center justify-center px-10 h-14 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            View Courses
                                        </button>
                                    </div>
                                    <div className="mt-12 flex items-center gap-4 text-base font-bold text-slate-500 dark:text-slate-400">
                                        <div className="flex -space-x-3">
                                            <div className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a0a0c] bg-[#fbbf24] shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPC9767ugBr3J1iNzyLPmmCK7OVeUmREdecnXqLpPkZw_Ya0Xgx051ZvFV8e5Z6LXvYWrhYPPlM-YbErVW77Vf96KBOg_ZOkHtx3tvC8bYNIt4nXRVh3oWTT6brs-Nm_HhhhXSX0OEPy0MSecMixpDhrbtRMKI5H9vdLo6n3yRbcEh8mIi3J8jgSVF6Ze6gSozfrD29e2KV6qMTRxGjCnjZ1ClLSbhP5HSQeM_2qkly6ZqGKBzVnGJETEGaV0-uODTBunxoD9AItw")', backgroundSize: 'cover' }}></div>
                                            <div className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a0a0c] bg-[#14b8a6] shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD9nhAwg8PzWVo7lNTgEcE0oI1Gt4IBZUJthNa2i1x_PH3ngMgSi6uEBkjkjhkjeXOyQM0M5qDrmXY7BGVAxVwCUcv4Im4o9z57La0fAvQtw4_40nRdRQ5yiuZmTeWAFtRZ85SQoJYAGQ6nqADwpIZ8Em9mae5rEfowkucwyKydf8bcTbTEn9zukHxdKBQ3UdINSh0QwXQvTIyNT6Inavd61aNWzlfkYVuvR1anklQtTp2pvpsUNLX61PNsE7t0XNCGtmGjHGQ81_0")', backgroundSize: 'cover' }}></div>
                                            <div className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a0a0c] bg-[#f97316] shadow-md" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGDEtCWP8qUE3fLB7TPBL9MDKY1sJA5sbw6BVr63kFWNEnYNcz7phJA11xpV_QS412JW4nq7IQrnG3SMQ7s33lsHUArkhY7INUbT8ugAC3eg6-YA_JSvUhXXXFbu2a5k7xxeMT9dH_vLrRAWTJTIi1ekLlxuns0cu97-weKrg301SacOwIRr0CO7Gt1fDRLt_t01rdfbHVeNyU9McQnLgSKYRW5P9dr9kofNzFQHfCz6CfV601G5b4Q8gP2T8Lw4dTqwTSTBjidac")', backgroundSize: 'cover' }}></div>
                                            <div className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a0a0c] bg-[#6366f1] flex items-center justify-center text-white text-xs">+50k</div>
                                        </div>
                                        <p>Join 50k+ active learners</p>
                                    </div>
                                </div>
                                <div className="relative flex justify-center lg:justify-end perspective-1000">
                                    <div className="floating-card relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 cartoon-border pop-shadow transform rotate-[-3deg] hover:rotate-0 transition-all duration-700">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 dark:bg-[#f97316]/20 flex items-center justify-center text-[#f97316] shadow-inner">
                                                    <span className="material-symbols-outlined text-4xl">bolt</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white leading-tight">Physics Master</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Advanced Level</p>
                                                </div>
                                            </div>
                                            <span className="px-4 py-1.5 rounded-full bg-[#14b8a6] text-white text-xs font-black uppercase tracking-wider shadow-sm">Active</span>
                                        </div>
                                        <div className="mb-8 space-y-3">
                                            <div className="flex justify-between text-sm font-bold">
                                                <span className="text-slate-600 dark:text-slate-300">Level 5 Progress</span>
                                                <span className="text-[#6366f1] text-lg">85%</span>
                                            </div>
                                            <div className="h-5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full p-1 overflow-hidden shadow-inner">
                                                <div className="h-full bg-gradient-to-r from-[#6366f1] via-[#14b8a6] to-[#fbbf24] w-[85%] rounded-full shadow-lg"></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border-2 border-slate-100 dark:border-slate-600/50">
                                                <p className="text-xs font-bold text-slate-400 mb-2">XP Earned</p>
                                                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">12,450</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border-2 border-slate-100 dark:border-slate-600/50">
                                                <p className="text-xs font-bold text-slate-400 mb-2">Streak</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[#f97316] text-2xl">local_fire_department</span>
                                                    <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">14 Days</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#fbbf24] rounded-full flex items-center justify-center shadow-2xl transform rotate-12 border-8 border-white dark:border-slate-800 hover:scale-110 transition-transform cursor-pointer">
                                            <span className="material-symbols-outlined text-white text-5xl">emoji_events</span>
                                        </div>
                                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#14b8a6] rounded-full blur-xl opacity-30"></div>
                                    </div>
                                    <div className="absolute top-12 left-12 lg:left-24 w-full max-w-md h-full bg-[#6366f1]/20 dark:bg-[#6366f1]/10 rounded-[2.5rem] -z-10 transform rotate-[4deg] blur-sm"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] via-[#14b8a6] to-[#fbbf24]"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                                <div className="p-4 transform hover:scale-110 transition-transform">
                                    <p className="text-5xl lg:text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">50k+</p>
                                    <p className="text-xs font-black text-[#6366f1] uppercase tracking-[0.2em]">Active Students</p>
                                </div>
                                <div className="p-4 transform hover:scale-110 transition-transform">
                                    <p className="text-5xl lg:text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">1M+</p>
                                    <p className="text-xs font-black text-[#14b8a6] uppercase tracking-[0.2em]">Quizzes Taken</p>
                                </div>
                                <div className="p-4 transform hover:scale-110 transition-transform">
                                    <p className="text-5xl lg:text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">4.8</p>
                                    <p className="text-xs font-black text-[#fbbf24] uppercase tracking-[0.2em]">Average Rating</p>
                                </div>
                                <div className="p-4 transform hover:scale-110 transition-transform">
                                    <p className="text-5xl lg:text-6xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">100+</p>
                                    <p className="text-xs font-black text-[#f97316] uppercase tracking-[0.2em]">Topics Covered</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-32 bg-white dark:bg-[#0a0a0c] relative">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center max-w-3xl mx-auto mb-20">
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">Why Edu Nexus?</h2>
                                <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Experience a new way of learning that combines education with the engagement of gaming mechanics.</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-10">
                                <div className="group p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-b-8 border-[#6366f1] hover:border-[#14b8a6] transition-all duration-300 hover:-translate-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform">
                                        <span className="material-symbols-outlined text-4xl">bolt</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Instant Feedback</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Get real-time results on your quizzes to learn faster. Identify gaps immediately and correct them on the spot.
                                    </p>
                                </div>
                                <div className="group p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-b-8 border-[#fbbf24] hover:border-[#f97316] transition-all duration-300 hover:-translate-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#fbbf24] text-white flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform">
                                        <span className="material-symbols-outlined text-4xl">ads_click</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Personalized Goals</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Set your own targets and track your progress daily. Our AI adapts the difficulty to your learning pace.
                                    </p>
                                </div>
                                <div className="group p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-b-8 border-[#14b8a6] hover:border-[#6366f1] transition-all duration-300 hover:-translate-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#14b8a6] text-white flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform">
                                        <span className="material-symbols-outlined text-4xl">groups</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Community Challenges</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        Compete with friends and earn badges together. Join study groups and climb the global leaderboards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-32 bg-slate-50 dark:bg-slate-900/30 relative overflow-hidden">
                        <div className="absolute top-10 right-10 w-32 h-32 bg-[#6366f1]/10 rounded-full"></div>
                        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#14b8a6]/10 rounded-3xl rotate-45"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                            <div className="text-center mb-20">
                                <span className="px-6 py-2 rounded-full bg-[#6366f1]/10 text-[#6366f1] font-black uppercase tracking-widest text-xs">Process</span>
                                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mt-6">How It Works</h2>
                            </div>
                            <div className="relative">
                                <div className="hidden md:block absolute top-10 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-700 z-0"></div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
                                    <div className="text-center group">
                                        <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 text-[#6366f1] border-4 border-[#6366f1] rounded-3xl flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-xl group-hover:bg-[#6366f1] group-hover:text-white transition-all">1</div>
                                        <h3 className="font-display font-bold text-xl mb-3 text-slate-900 dark:text-white">Pick a Skill</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Choose from over 100+ topics ranging from coding to design.</p>
                                    </div>
                                    <div className="text-center group">
                                        <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 text-[#14b8a6] border-4 border-[#14b8a6] rounded-3xl flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-xl group-hover:bg-[#14b8a6] group-hover:text-white transition-all">2</div>
                                        <h3 className="font-display font-bold text-xl mb-3 text-slate-900 dark:text-white">Complete Quizzes</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Engage with interactive bite-sized lessons and quizzes.</p>
                                    </div>
                                    <div className="text-center group">
                                        <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 text-[#fbbf24] border-4 border-[#fbbf24] rounded-3xl flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-xl group-hover:bg-[#fbbf24] group-hover:text-white transition-all">3</div>
                                        <h3 className="font-display font-bold text-xl mb-3 text-slate-900 dark:text-white">Earn Badges</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Unlock achievements and showcase your mastery.</p>
                                    </div>
                                    <div className="text-center group">
                                        <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800 text-[#f97316] border-4 border-[#f97316] rounded-3xl flex items-center justify-center text-3xl font-display font-bold mb-6 shadow-xl group-hover:bg-[#f97316] group-hover:text-white transition-all">4</div>
                                        <h3 className="font-display font-bold text-xl mb-3 text-slate-900 dark:text-white">Unlock Levels</h3>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Level up your profile and access advanced career tracks.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-24">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="relative bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#14b8a6] rounded-[3rem] p-16 overflow-hidden text-center shadow-2xl">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fbbf24]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">Ready to Level Up?</h2>
                                    <p className="text-blue-50 text-xl mb-12 max-w-2xl mx-auto font-medium">Join the fastest growing gamified learning community. Start your journey for free today.</p>
                                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                        <Link to="/register" className="inline-flex items-center justify-center px-12 h-16 rounded-full bg-white text-[#6366f1] font-display font-bold text-xl shadow-[0_6px_0_0_#cbd5e1] hover:shadow-[0_2px_0_0_#cbd5e1] hover:translate-y-1 transition-all">
                                            Get Started for Free
                                        </Link>
                                        <button className="px-12 h-16 rounded-full bg-black/20 border-2 border-white/30 text-white font-display font-bold text-xl hover:bg-black/30 transition-all">
                                            View Syllabus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="bg-white dark:bg-[#0a0a0c] border-t-2 border-slate-100 dark:border-slate-800 pt-24 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                            <div className="col-span-2 lg:col-span-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-xl">school</span>
                                    </div>
                                    <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">Edu Nexus</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-base mb-8 max-w-xs font-medium">
                                    Making education accessible, engaging, and effective for everyone through the power of gamification.
                                </p>
                                <div className="flex gap-5">
                                    <a className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#6366f1] hover:text-white transition-all hover:-translate-y-1" href="#">
                                        <span className="sr-only">Twitter</span>
                                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                                    </a>
                                    <a className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#14b8a6] hover:text-white transition-all hover:-translate-y-1" href="#">
                                        <span className="sr-only">GitHub</span>
                                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path></svg>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Platform</h4>
                                <ul className="space-y-4 text-base font-medium text-slate-500 dark:text-slate-400">
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Courses</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Features</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Teachers</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Pricing</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
                                <ul className="space-y-4 text-base font-medium text-slate-500 dark:text-slate-400">
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">About Us</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Careers</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Blog</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
                                <ul className="space-y-4 text-base font-medium text-slate-500 dark:text-slate-400">
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Community</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Help Center</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Terms of Service</a></li>
                                    <li><a className="hover:text-[#6366f1] transition-colors" href="#">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t-2 border-slate-100 dark:border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-base font-bold text-slate-400">© 2023 Edu Nexus Inc. All rights reserved.</p>
                            <div className="flex items-center gap-8 text-base font-bold text-slate-400">
                                <a className="hover:text-[#6366f1] transition-colors" href="#">Privacy</a>
                                <a className="hover:text-[#6366f1] transition-colors" href="#">Terms</a>
                                <a className="hover:text-[#6366f1] transition-colors" href="#">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>


        </div>
    );
};

export default Landing;
