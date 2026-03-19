import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import ShooterQuiz from '../../components/game/ShooterQuiz';
import MemoryQuiz from '../../components/game/MemoryQuiz';
import { ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Quiz = () => {
    const { subjectId, chapterId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    const [hasAttempted, setHasAttempted] = useState(false);
    const [previousScore, setPreviousScore] = useState(null);

    useEffect(() => {
        const fetchQuizAndAttempts = async () => {
            try {
                // Fetch Quiz
                console.log(`[DEBUG] Fetching quiz for game: subjectId=${subjectId}, chapterId=${chapterId}`);
                const response = await quizAPI.get(subjectId, chapterId);
                console.log('[DEBUG] Quiz response:', response.data);

                if (response.data.success && response.data.data) {
                    setQuiz(response.data.data);

                    // Check for existing attempts
                    const attemptsRes = await quizAPI.getMyAttempts();
                    if (attemptsRes.data.success) {
                        const attempt = attemptsRes.data.data.find(a => a.quizId === response.data.data._id);
                        if (attempt) {
                            setHasAttempted(true);
                            setPreviousScore(attempt.score);
                        }
                    }
                } else {
                    toast.error('No quiz found for this chapter');
                }
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
                toast.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAndAttempts();
    }, [subjectId, chapterId]);

    const handleQuizComplete = async (score, maxScore, shouldExit, answers) => {
        try {
            // Submit to Quiz API (Records attempt, XP, and badges)
            await quizAPI.submit(subjectId, chapterId, answers || []);

            toast.success(`Quiz Completed! Score: ${score}/${maxScore}`);
        } catch (error) {
            console.error('Failed to submit quiz:', error);
            toast.error('Failed to save progress');
        } finally {
            if (shouldExit) {
                navigate(`/subject/${subjectId}`);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] flex flex-col items-center justify-center p-8 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-12 cartoon-border pop-shadow flex flex-col items-center justify-center gap-4 border-[4px] border-slate-100 dark:border-slate-700">
                <Loader className="animate-spin text-[#6366f1] w-12 h-12" />
                <span className="font-display font-bold text-slate-800 dark:text-white text-xl">Loading Game...</span>
            </div>
        </div>
    );

    if (hasAttempted) return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] flex flex-col items-center justify-center p-8 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-8 sm:p-12 cartoon-border pop-shadow text-center flex flex-col items-center gap-6 max-w-md w-full border-[4px] border-slate-100 dark:border-slate-700">
                <div className="w-20 h-20 rounded-2xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-sm mb-2">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white">Quiz Completed!</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium">You have already conquered this challenge.</p>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700/50 w-full mt-2 mb-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Previous Score</span>
                        <span className="text-5xl font-display font-black text-[#f97316] drop-shadow-sm">{previousScore}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/subject/${subjectId}`)}
                    className="flex items-center justify-center px-8 h-14 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all w-full gap-3 text-lg"
                >
                    <ArrowLeft size={24} /> Back to Chapter
                </button>
            </div>
        </div>
    );

    if (!quiz) return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] flex flex-col items-center justify-center p-8 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800/80 rounded-[2.5rem] p-10 cartoon-border pop-shadow text-center flex flex-col items-center gap-6 max-w-md border-[4px] border-slate-100 dark:border-slate-700">
                <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm mb-2">
                    <span className="material-symbols-outlined text-[48px]">error</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Quiz Not Found</h2>
                <button onClick={() => navigate(-1)} className="flex items-center justify-center px-8 h-12 rounded-2xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-[3px] border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-100 font-bold shadow-[0_4px_0_0_#e2e8f0] dark:shadow-[0_4px_0_0_#475569] active:shadow-none active:translate-y-1 transition-all gap-2 mt-4">
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 relative">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 flex items-center justify-center px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold transition-all gap-2 z-50 border border-white/20"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="w-full max-w-5xl h-[85vh] bg-slate-900 rounded-[2.5rem] cartoon-border pop-shadow border-[4px] border-slate-800 overflow-hidden relative shadow-2xl">
                {quiz.gameType === 'memory' ? (
                    <MemoryQuiz quiz={quiz} onComplete={handleQuizComplete} />
                ) : (
                    <ShooterQuiz quiz={quiz} onComplete={handleQuizComplete} />
                )}
            </div>
        </div>
    );
};

export default Quiz;
