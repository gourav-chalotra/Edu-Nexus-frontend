import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Rocket, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Constants ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 8; // Faster movement
const LASER_SPEED = 15; // Faster lasers
const ENEMY_FALL_SPEED = 1.2;
const PLAYER_WIDTH = 64;
const PLAYER_HEIGHT = 64;
const LASER_WIDTH = 8;
const LASER_HEIGHT = 30;

const ShooterQuiz = ({ quiz, onComplete }) => {
    // Core Game State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost', 'transition'
    const [feedbackInfo, setFeedbackInfo] = useState(null);
    const [streak, setStreak] = useState(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    // Engine Refs (Used strictly for mutable logic inside rAF)
    const requestRef = useRef();
    const gameEngine = useRef({
        player: { x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 },
        lasers: [],
        targets: [],
        explosions: [],
        keys: { a: false, d: false, arrowleft: false, arrowright: false, space: false },
        lastShot: 0,
        isTransitioning: false
    });

    // Reactive State (Used explicitly to render the DOM positions every frame)
    const [renderState, setRenderState] = useState({
        player: { x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20 },
        lasers: [],
        targets: [],
        explosions: []
    });

    // Setup Targets for Current Question
    const initializeTargets = useCallback(() => {
        if (!currentQuestion) return;
        const numTargets = currentQuestion.options.length;
        const spacing = GAME_WIDTH / numTargets;

        gameEngine.current.targets = currentQuestion.options.map((option, index) => {
            const x = (index * spacing) + (spacing / 2) - 80;
            return {
                id: `target-${currentQuestionIndex}-${index}`,
                x,
                y: -100 - (Math.random() * 50),
                width: 160,
                height: 80,
                optionText: option,
                isDead: false
            };
        });
        gameEngine.current.lasers = [];
        gameEngine.current.explosions = [];

        // Sync Initial Render State
        setRenderState({
            player: { ...gameEngine.current.player },
            lasers: [...gameEngine.current.lasers],
            targets: [...gameEngine.current.targets],
            explosions: [...gameEngine.current.explosions]
        });
    }, [currentQuestion, currentQuestionIndex]);

    useEffect(() => {
        if (gameState === 'playing') {
            gameEngine.current.isTransitioning = false;
            initializeTargets();
        } else {
            gameEngine.current.isTransitioning = true;
        }
    }, [initializeTargets, gameState]);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (gameEngine.current.keys.hasOwnProperty(key)) {
                gameEngine.current.keys[key] = true;
            } else if (e.code === 'Space') {
                gameEngine.current.keys.space = true;
                e.preventDefault(); // Stop scrolling
            }
        };

        const handleKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (gameEngine.current.keys.hasOwnProperty(key)) {
                gameEngine.current.keys[key] = false;
            } else if (e.code === 'Space') {
                gameEngine.current.keys.space = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Collision Detection
    const checkCollision = (rect1, rect2) => {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    };

    // Main Game Loop (60 FPS)
    const gameLoop = useCallback((time) => {
        if (gameEngine.current.isTransitioning) {
            requestRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        const e = gameEngine.current;

        // 1. Process Input -> Player Movement
        if (e.keys.a || e.keys.arrowleft) {
            e.player.x = Math.max(0, e.player.x - PLAYER_SPEED);
        }
        if (e.keys.d || e.keys.arrowright) {
            e.player.x = Math.min(GAME_WIDTH - PLAYER_WIDTH, e.player.x + PLAYER_SPEED);
        }

        // 2. Process Input -> Shooting
        if (e.keys.space) {
            const now = Date.now();
            if (now - e.lastShot > 250) { // 250ms fire rate
                // Add TWO lasers for a cooler effect
                e.lasers.push({
                    id: `laser-${now}-L`,
                    x: e.player.x + 10, // Left wing
                    y: e.player.y
                });
                e.lasers.push({
                    id: `laser-${now}-R`,
                    x: e.player.x + PLAYER_WIDTH - 10 - LASER_WIDTH, // Right wing
                    y: e.player.y
                });
                e.lastShot = now;
            }
        }

        let targetsToKeep = [];
        let lasersToKeep = [];
        let hasHit = false;

        // 3. Update Targets
        for (let target of e.targets) {
            if (target.isDead) continue;
            target.y += ENEMY_FALL_SPEED;

            if (target.y > GAME_HEIGHT) {
                target.isDead = true;
                if (target.optionText === currentQuestion?.correctAnswer) {
                    handleMiss("Correct answer escaped!");
                }
            } else {
                targetsToKeep.push(target);
            }
        }
        e.targets = targetsToKeep;

        // 4. Update Lasers & Collisions
        for (let laser of e.lasers) {
            laser.y -= LASER_SPEED;
            let laserHit = false;

            if (laser.y < -LASER_HEIGHT) continue; // Laser off screen

            for (let i = 0; i < e.targets.length; i++) {
                let target = e.targets[i];
                if (checkCollision(
                    { x: laser.x, y: laser.y, width: LASER_WIDTH, height: LASER_HEIGHT },
                    { x: target.x, y: target.y, width: target.width, height: target.height }
                )) {
                    // Collision Detected!
                    laserHit = true;
                    target.isDead = true;
                    e.targets.splice(i, 1);

                    e.explosions.push({
                        id: `exp-${Date.now()}-${Math.random()}`,
                        x: target.x + target.width / 2,
                        y: target.y + target.height / 2,
                        color: target.optionText === currentQuestion?.correctAnswer ? '#10b981' : '#ef4444'
                    });

                    if (!hasHit) { // Only process one hit per frame to avoid double triggers
                        hasHit = true;
                        e.isTransitioning = true; // Pause loop
                        if (target.optionText === currentQuestion?.correctAnswer) {
                            handleValidHit(true);
                        } else {
                            handleValidHit(false);
                        }
                    }
                    break;
                }
            }

            if (!laserHit) {
                lasersToKeep.push(laser);
            }
        }
        e.lasers = lasersToKeep;

        // Clean up old explosions
        if (e.explosions.length > 8) e.explosions.shift();

        // 5. Publish State for React Render
        setRenderState({
            player: { ...e.player },
            lasers: [...e.lasers],
            targets: [...e.targets],
            explosions: [...e.explosions]
        });

        // 6. Loop
        requestRef.current = requestAnimationFrame(gameLoop);
    }, [currentQuestionIndex, currentQuestion]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameLoop]);

    const handleValidHit = (isCorrect) => {
        if (isCorrect) {
            const points = currentQuestion.points || 100;
            const streakBonus = streak * 15;
            setScore(prev => prev + points + streakBonus);
            setStreak(prev => prev + 1);
            setFeedbackInfo({ text: 'DIRECT HIT!', color: '#10b981' });

            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#fcd34d'] });

            setTimeout(() => advanceLevel(), 1500);
        } else {
            setStreak(0);
            setFeedbackInfo({ text: 'WRONG TARGET!', color: '#ef4444' });
            setLives(prev => {
                const newLives = prev - 1;
                if (newLives <= 0) setTimeout(() => endGame(false), 500);
                else setTimeout(() => restartLevel(), 1500);
                return newLives;
            });
        }
    };

    const handleMiss = (reason) => {
        gameEngine.current.isTransitioning = true;
        setStreak(0);
        setFeedbackInfo({ text: reason.toUpperCase(), color: '#f59e0b' });
        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setTimeout(() => endGame(false), 500);
            else setTimeout(() => restartLevel(), 1500);
            return newLives;
        });
    };

    const advanceLevel = () => {
        setFeedbackInfo(null);
        if (currentQuestionIndex < quiz.questions.length - 1) {
            gameEngine.current.isTransitioning = false;
            setCurrentQuestionIndex(prev => prev + 1);
            setGameState('playing');
        } else {
            endGame(true);
        }
    };

    const restartLevel = () => {
        setFeedbackInfo(null);
        gameEngine.current.player.x = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
        gameEngine.current.isTransitioning = false;
        initializeTargets();
        setGameState('playing');
    };

    const endGame = (won) => {
        setGameState(won ? 'won' : 'lost');
        if (won) {
            const endConfetti = () => confetti({ particleCount: 150, spread: 120, origin: { y: 0.2 }, colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'] });
            endConfetti();
        }

        setTimeout(() => {
            const maxScore = quiz.questions.reduce((acc, q) => acc + (q.points || 100), 0);
            onComplete(score, maxScore, true, []);
        }, 3000);
    };


    // Render Loss / Win Screens
    if (gameState === 'won' || gameState === 'lost') {
        return (
            <div className="w-full h-full bg-[#0a0f1c] rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden p-8 border-[4px] border-slate-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] cursor-default">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative z-10 bg-[#162032] p-8 sm:p-12 rounded-[2rem] border-[4px] border-[#334155] flex flex-col items-center max-w-md w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${gameState === 'won' ? 'bg-[#10b981]/20 border-4 border-[#10b981] text-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-[#ef4444]/20 border-4 border-[#ef4444] text-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.4)]'}`}>
                        {gameState === 'won' ? <Trophy size={56} /> : <Skull size={56} />}
                    </div>

                    <h2 className={`text-4xl sm:text-5xl font-display font-black mb-4 tracking-wider uppercase ${gameState === 'won' ? 'text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}>
                        {gameState === 'won' ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
                    </h2>

                    <div className="bg-[#0f172a] p-6 rounded-2xl w-full border-[3px] border-[#1e293b] mb-6 shadow-inner relative overflow-hidden">
                        <p className="text-sm font-bold text-[#94a3b8] uppercase tracking-[0.2em] mb-2 relative z-10">Total Score</p>
                        <p className="text-6xl font-display font-black text-[#facc15] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] relative z-10">{score}</p>
                    </div>

                    {!gameState.won && (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-6 py-4 bg-transparent border-4 border-[#3b82f6] text-[#60a5fa] hover:bg-[#3b82f6]/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-2xl font-black uppercase tracking-wider transition-all text-lg"
                        >
                            Retry Mission
                        </button>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#020617] rounded-[2.5rem] overflow-hidden flex flex-col items-center p-4 relative" style={{ userSelect: 'none' }}>

            {/* Stars Background Component */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-[200%] absolute top-[-100%] animate-[slideDown_10s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.1 }}></div>
                <div className="w-full h-[200%] absolute top-[-100%] animate-[slideDown_20s_linear_infinite]" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 2px, transparent 2px)', backgroundSize: '120px 120px', opacity: 0.15 }}></div>
            </div>

            {/* HUD Header */}
            <div className="w-full max-w-4xl flex justify-between items-start z-20 font-mono px-4 h-16">
                {/* Lives Left */}
                <div className="flex bg-[#0f172a]/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-[#1e293b] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Zap key={i} size={20} className={`transition-all duration-300 ${i < lives ? 'fill-[#ef4444] text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'fill-transparent text-[#334155]'}`} />
                        ))}
                    </div>
                </div>

                {/* Score Track */}
                <div className="flex bg-[#0f172a]/80 backdrop-blur-sm px-5 py-2 rounded-xl border-2 border-[#1e293b] shadow-[0_0_15px_rgba(0,0,0,0.5)] divide-x divide-[#334155]">
                    <div className="flex flex-col items-end pr-4">
                        <span className="text-[10px] font-bold text-[#64748b] tracking-[0.2em]">SCORE</span>
                        <div className="text-[#eab308] font-black text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                            {score.toString().padStart(5, '0')}
                        </div>
                    </div>
                    <div className="flex flex-col items-start pl-4">
                        <span className="text-[10px] font-bold text-[#64748b] tracking-[0.2em]">COMBO</span>
                        <div className={`font-black text-lg transition-colors duration-300 ${streak > 2 ? 'text-[#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-[#94a3b8]'}`}>
                            x{streak}
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Question Banner */}
            <div className="w-full max-w-3xl z-20 text-center pointer-events-none mt-4 mb-4">
                <div className="inline-block bg-[#0f172a]/90 backdrop-blur-md border border-[#38bdf8]/30 px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <p className="text-xs font-bold text-[#38bdf8] uppercase tracking-widest mb-1 shadow-black drop-shadow-md">Question {currentQuestionIndex + 1}/{quiz.questions.length}</p>
                    <h3 className="text-xl font-display font-black text-white shadow-black drop-shadow-md leading-tight">{currentQuestion?.question}</h3>
                </div>
            </div>

            {/* Game Canvas Container */}
            <div className="relative flex-1 w-full flex items-center justify-center pointer-events-none">
                <div
                    className="relative bg-transparent/10 border-x border-[#38bdf8]/10"
                    style={{ width: GAME_WIDTH, height: GAME_HEIGHT, pointerEvents: 'none' }}
                >
                    {/* Render Falling Targets (Options) */}
                    {renderState.targets.map(target => (
                        <div
                            key={target.id}
                            className="absolute flex items-center justify-center p-3 text-center transition-none bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-2 border-[#94a3b8] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] shadow-inner"
                            style={{
                                left: target.x,
                                top: target.y,
                                width: target.width,
                                height: target.height,
                            }}
                        >
                            <span className="text-white font-bold leading-tight line-clamp-3 text-sm drop-shadow-md">{target.optionText}</span>
                        </div>
                    ))}

                    {/* Render Flying Lasers */}
                    {renderState.lasers.map(laser => (
                        <div
                            key={laser.id}
                            className="absolute bg-[#38bdf8] rounded-full shadow-[0_0_15px_3px_rgba(56,189,248,0.9)]"
                            style={{
                                left: laser.x,
                                top: laser.y,
                                width: LASER_WIDTH,
                                height: LASER_HEIGHT,
                                background: 'linear-gradient(to top, #bae6fd, #38bdf8)'
                            }}
                        />
                    ))}

                    {/* Render Player Airplane */}
                    <div
                        className="absolute flex flex-col items-center transition-none"
                        style={{ left: renderState.player.x, top: renderState.player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }}
                    >
                        <div className="relative text-white w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center justify-center">
                            <Rocket size={72} strokeWidth={1.5} className="transform -rotate-45 text-[#bae6fd] fill-[#0284c7]" />
                        </div>
                        {/* Engine thrust glow */}
                        <div className="absolute -bottom-8 w-6 h-12 bg-gradient-to-t from-transparent via-[#f97316] to-[#fbbf24] blur-[4px] opacity-80 animate-pulse rounded-full"></div>
                    </div>

                    {/* Render Explosion FX */}
                    <AnimatePresence>
                        {renderState.explosions.map(exp => (
                            <motion.div
                                key={exp.id}
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    left: exp.x - 40,
                                    top: exp.y - 40,
                                    width: 80,
                                    height: 80,
                                    backgroundColor: exp.color,
                                    boxShadow: `0 0 40px 10px ${exp.color}`,
                                    filter: 'blur(2px)'
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Hit / Miss Flash Feedback */}
            <AnimatePresence>
                {feedbackInfo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="absolute inset-x-0 top-[30%] flex items-center justify-center z-50 pointer-events-none"
                    >
                        <h2
                            className="text-6xl sm:text-8xl font-display font-black italic tracking-tighter uppercase drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
                            style={{
                                color: feedbackInfo.color,
                                WebkitTextStroke: '2px black'
                            }}
                        >
                            {feedbackInfo.text}
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Helps */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/70 text-sm font-mono font-bold tracking-widest z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2"><div className="px-2 py-1 bg-white/20 rounded text-white shadow-inner">A</div><div className="px-2 py-1 bg-white/20 rounded text-white shadow-inner">D</div> <span>MOVE</span></div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center gap-2"><div className="px-6 py-1 bg-white/20 rounded text-white shadow-inner">—</div> <span>SHOOT</span></div>
            </div>
        </div>
    );
};

export default ShooterQuiz;
