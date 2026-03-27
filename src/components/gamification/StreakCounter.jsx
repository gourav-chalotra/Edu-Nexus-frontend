// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakCounter = ({ days }) => {
    return (
        // eslint-disable-next-line no-unused-vars
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </motion.div>
            <span className="font-bold text-orange-700">{days} Day Streak</span>
        </div>
    );
};

export default StreakCounter;
