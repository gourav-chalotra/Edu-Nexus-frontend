// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
// Actually, let's stick to Framer Motion for simplicity.

const RewardPopup = ({ isOpen, onClose, title, xp, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-secondary-500"></div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl mb-4"
                        >
                            🎉
                        </motion.div>

                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
                        <p className="text-slate-600 mb-6">{message}</p>

                        <div className="bg-primary-50 rounded-xl p-4 mb-6">
                            <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Rewards</span>
                            <div className="text-3xl font-bold text-primary-700 mt-1">+{xp} XP</div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full btn-primary py-3 text-lg"
                        >
                            Awesome!
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RewardPopup;
