import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Timer, Trophy, Heart, Sparkles, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

const MemoryQuiz = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 30);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [userAnswers, setUserAnswers] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [streak, setStreak] = useState(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    // Timer Effect
    useEffect(() => {
        if (gameState !== 'playing' || feedback) return; // Pause timer when feedback shows

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeOut();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentQuestionIndex, feedback]);

    const handleTimeOut = () => {
        handleOptionSelect(null, true);
    };

    const handleOptionSelect = (option, isTimeout = false) => {
        if (selectedOption || gameState !== 'playing') return;

        setSelectedOption(option);

        const isCorrect = !isTimeout && option === currentQuestion.correctAnswer;
        const points = currentQuestion.points || 100;
        const streakBonus = streak * 10;

        // Record Answer
        const answerRecord = {
            questionId: currentQuestion.id,
            userAnswer: option || 'TIMEOUT',
            isCorrect,
            timeTaken: (quiz.timeLimit || 30) - timeLeft
        };
        setUserAnswers(prev => [...prev, answerRecord]);

        if (isCorrect) {
            setScore(prev => prev + points + streakBonus);
            setStreak(prev => prev + 1);
            setFeedback('correct');
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#34d399', '#fcd34d']
            });
        } else {
            setLives(prev => prev - 1);
            setStreak(0); // Reset streak
            setFeedback('wrong');
            if (lives - 1 <= 0) {
                endGame(false);
                return;
            }
        }

        // Delay before next question
        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setFeedback(null);
                setTimeLeft(quiz.timeLimit || 30);
            } else {
                endGame(true);
            }
        }, 2000);
    };

    const endGame = (won) => {
        setGameState(won ? 'won' : 'lost');
        if (won) {
            const endConfetti = () => {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0 },
                    colors: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24']
                });
            }
            endConfetti();
            setTimeout(endConfetti, 500);
        }

        // Wait a moment then call onComplete
        setTimeout(() => {
            // Calculate max score
            const maxScore = quiz.questions.reduce((acc, q) => acc + (q.points || 100), 0);
            onComplete(score, maxScore, true, userAnswers);
        }, 3000);
    };

    if (gameState !== 'playing') {
        return (
            <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden p-8 border-[4px] border-slate-200 dark:border-slate-800 cartoon-border pop-shadow">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2rem] border-[4px] border-slate-100 dark:border-slate-700 cartoon-border pop-shadow flex flex-col items-center max-w-md w-full text-center shadow-xl"
                >
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${gameState === 'won' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                        {gameState === 'won' ? <Trophy size={48} className="drop-shadow-sm" /> : <Brain size={48} className="drop-shadow-sm" />}
                    </div>

                    <h2 className={`text-4xl sm:text-5xl font-display font-black mb-4 drop-shadow-sm ${gameState === 'won' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                        {gameState === 'won' ? 'QUIZ CLEARED!' : 'GAME OVER!'}
                    </h2>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl w-full border-2 border-slate-100 dark:border-slate-700/50 mb-6">
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Final Score</p>
                        <p className="text-5xl font-display font-black text-[#fbbf24] drop-shadow-sm">{score}</p>
                        {gameState === 'lost' && <p className="text-[#ef4444] font-bold mt-3 bg-[#ef4444]/10 py-2 rounded-xl border border-[#ef4444]/20">Ran out of hearts!</p>}
                    </div>

                    {!gameState.won && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-6 py-4 bg-slate-200 text-slate-800 rounded-2xl font-bold shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 transition-all text-lg"
                        >
                            Try Again
                        </button>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full max-w-5xl mx-auto bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 relative">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            {/* Header HUD */}
            <div className="w-full flex flex-wrap sm:flex-nowrap justify-between items-center z-10 gap-4 mb-4 sm:mb-8">

                {/* Hearts */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow shadow-sm order-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                            key={i}
                            size={24}
                            className={`transition-all duration-300 ${i < lives
                                ? 'fill-[#ef4444] text-[#ef4444] scale-100 drop-shadow-sm'
                                : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700 scale-75 opacity-50'}`}
                        />
                    ))}
                </div>

                {/* Score & Streak Component */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow shadow-sm order-3 sm:order-2 w-full sm:w-auto justify-center">
                    <div className="flex flex-col items-center sm:items-end border-r-2 border-slate-100 dark:border-slate-700 pr-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">SCORE</span>
                        <div className="flex items-center gap-1.5 text-[#fbbf24] font-black text-2xl drop-shadow-sm leading-none">
                            <Trophy size={18} className="text-[#fbbf24]" />
                            {score}
                        </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-start pl-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">STREAK</span>
                        <div className="flex items-center gap-1 text-[#f97316] font-black text-xl drop-shadow-sm leading-none">
                            <Sparkles size={16} />
                            x{streak}
                        </div>
                    </div>
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow shadow-sm min-w-[100px] order-2 sm:order-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">TIME</span>
                    <div className={`flex items-center gap-1.5 font-display font-black text-2xl tracking-wider leading-none ${timeLeft <= 5 ? 'text-[#ef4444] animate-pulse' : 'text-[#3b82f6] dark:text-[#60a5fa]'}`}>
                        <Timer size={20} className={timeLeft <= 5 ? 'animate-bounce' : ''} />
                        {timeLeft}
                    </div>
                </div>
            </div>

            {/* Game Content Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 w-full max-w-4xl py-4">

                {/* Question Info */}
                <div className="mb-4 sm:mb-8 text-center bg-white dark:bg-slate-800/80 px-4 py-1.5 rounded-full inline-block border-2 border-slate-100 dark:border-slate-700 shadow-sm text-xs sm:text-sm font-bold text-[#6366f1] dark:text-[#818cf8] uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>

                {/* Question Text Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`q-${currentQuestionIndex}`}
                        initial={{ x: 50, opacity: 0, rotate: 2 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: -50, opacity: 0, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full bg-white dark:bg-slate-800 p-8 sm:p-12 text-center rounded-[2.5rem] border-[4px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow mb-8 sm:mb-12 shadow-md relative"
                    >
                        {/* Decorative Pin */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#fbbf24] rounded-full border-[3px] border-white dark:border-slate-800 shadow-md"></div>

                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-800 dark:text-white leading-tight">
                            {currentQuestion.question}
                        </h3>
                    </motion.div>
                </AnimatePresence>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <AnimatePresence mode="popLayout">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === option;
                            const isCorrectAns = option === currentQuestion.correctAnswer;

                            // Determine button styling state
                            let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#6366f1] dark:hover:border-[#818cf8] hover:bg-[#6366f1]/5 shadow-[0_4px_0_0_#e2e8f0] dark:shadow-[0_4px_0_0_#334155]";
                            let icon = null;

                            if (feedback) {
                                if (isCorrectAns) {
                                    btnStyle = "bg-[#10b981] border-[#059669] text-white shadow-[0_4px_0_0_#059669]";
                                    icon = <Check className="text-white drop-shadow-md" size={28} />;
                                } else if (isSelected && !isCorrectAns) {
                                    btnStyle = "bg-[#ef4444] border-[#b91c1c] text-white shadow-[0_4px_0_0_#b91c1c]";
                                    icon = <X className="text-white drop-shadow-md" size={28} />;
                                } else {
                                    btnStyle = "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 opacity-60 shadow-none translate-y-1";
                                }
                            }

                            return (
                                <motion.button
                                    key={`opt-${currentQuestionIndex}-${index}`}
                                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
                                    whileHover={!feedback && !selectedOption ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!feedback && !selectedOption ? { scale: 0.98, y: 2 } : {}}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={selectedOption !== null}
                                    className={`
                                        relative px-6 py-6 sm:py-8 rounded-2xl text-lg sm:text-xl font-bold text-center transition-all duration-300 border-[3px] flex items-center justify-center gap-4 ${btnStyle}
                                        ${(!feedback && !selectedOption) ? 'active:shadow-none active:translate-y-1' : ''}
                                    `}
                                >
                                    <span className="flex-1 text-center font-display tracking-wide">{option}</span>
                                    {icon && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="absolute right-4 sm:right-6"
                                        >
                                            {icon}
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Central Feedback Splash */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                        <div className={`
                            px-12 py-6 rounded-full border-[6px] shadow-2xl flex items-center justify-center gap-4
                            ${feedback === 'correct'
                                ? 'bg-white border-[#10b981] text-[#10b981] shadow-[#10b981]/30 rotate-[-5deg]'
                                : 'bg-white border-[#ef4444] text-[#ef4444] shadow-[#ef4444]/30 rotate-[5deg]'}
                        `}>
                            {feedback === 'correct' ? <Check size={56} className="drop-shadow-sm" strokeWidth={3} /> : <X size={56} className="drop-shadow-sm" strokeWidth={3} />}
                            <span className="text-5xl font-display font-black tracking-widest uppercase drop-shadow-sm">
                                {feedback === 'correct' ? 'BRILLIANT' : 'INCORRECT'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar (Bottom) */}
            <div className="w-full mt-6 bg-slate-200 dark:bg-slate-700 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 overflow-hidden shadow-inner relative z-10">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuestionIndex / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                </motion.div>
            </div>
        </div>
    );
};

export default MemoryQuiz;
