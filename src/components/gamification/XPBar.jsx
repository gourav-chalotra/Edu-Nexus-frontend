// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const XPBar = ({ current, max, level }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-slate-600">Level {level}</span>
                <span className="text-xs font-medium text-slate-500">{current} / {max} XP</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full relative"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default XPBar;
