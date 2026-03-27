import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useCurriculum } from '../../context/CurriculumContext';
import { ArrowLeft, BookOpen, PlayCircle, Star } from 'lucide-react';
import { quizAPI } from '../../services/api';

const SubjectDetail = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { curriculum } = useCurriculum();
    const subject = curriculum[subjectId];

    const [chapterScores, setChapterScores] = useState({});

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await quizAPI.getMyAttempts();
                if (response.data.success) {
                    const attempts = response.data.data;
                    const maxScores = {};

                    attempts.forEach(attempt => {
                        // Only process attempts for this subject
                        if (attempt.subjectId === subjectId) {
                            const currentMax = maxScores[attempt.chapterId] || 0;
                            if (attempt.score > currentMax) {
                                maxScores[attempt.chapterId] = attempt.score;
                            }
                        }
                    });

                    setChapterScores(maxScores);
                }
            } catch (error) {
                console.error("Failed to fetch quiz attempts", error);
            }
        };

        if (subject) {
            fetchScores();
        }
    }, [subjectId, subject]);

    if (!subject) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-center p-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 cartoon-border pop-shadow text-center">
                    <p className="font-display font-bold text-slate-900 dark:text-white text-xl">Subject not found</p>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-full font-bold shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased transition-colors duration-300 pb-20">
            {/* Dark Mode Wrapper logic is generally handled higher up, just use standard classes */}

            {/* Header */}
            <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0a0a0c]/80 border-b-[3px] border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-white dark:bg-slate-800 border-[3px] border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#14b8a6] flex items-center justify-center text-white shadow-md text-sm">
                                {subject.icon}
                            </div>
                            {subject.title}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-8">
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">{subject.description}</p>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center text-[#f97316] shadow-sm">
                        <span className="material-symbols-outlined text-[30px]">auto_stories</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Chapters & Topics</h2>
                </div>

                <div className="space-y-6">
                    {subject.chapters.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800/80 rounded-[2rem] border-[4px] border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden relative cartoon-border pop-shadow"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-2">{chapter.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{chapter.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                        <div className="text-sm font-black text-[#6366f1] dark:text-[#818cf8] bg-[#6366f1]/10 px-3 py-1 rounded-xl">
                                            {chapter.progress}% COMPLETED
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-[#14b8a6] to-[#10b981] rounded-full transition-all duration-500 relative" style={{ width: `${chapter.progress}%` }}>
                                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {chapter.topics.map(topic => (
                                        <span key={topic} className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 shadow-sm">
                                            {topic}
                                        </span>
                                    ))}
                                    {chapterScores[chapter.id] !== undefined && (
                                        <div className="absolute top-4 right-4 sm:static sm:mb-4 sm:ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 font-bold text-sm shadow-sm">
                                            <Star size={16} className="fill-amber-400 text-amber-500" />
                                            Best Score: {chapterScores[chapter.id]} XP
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-slate-100 dark:border-slate-700/50">
                                    <Link
                                        to={`/learn/${subjectId}/${chapter.id}`}
                                        className="flex-1 flex items-center justify-center px-6 h-12 lg:h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-sm lg:text-base shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all gap-2"
                                    >
                                        <BookOpen size={20} />
                                        <span>Start Learning</span>
                                    </Link>
                                    <Link
                                        to={`/quiz/${subjectId}/${chapter.id}`}
                                        className="flex-1 flex items-center justify-center px-6 h-12 lg:h-14 rounded-2xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-[3px] border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-100 font-bold text-sm lg:text-base shadow-[0_4px_0_0_#e2e8f0] dark:shadow-[0_4px_0_0_#475569] active:shadow-none active:translate-y-1 transition-all gap-2"
                                    >
                                        <PlayCircle size={20} className="text-[#f97316]" />
                                        <span>Take Test</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SubjectDetail;
