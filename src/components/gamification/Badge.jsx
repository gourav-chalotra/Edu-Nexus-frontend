// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Badge = ({ icon, name, description, earned = false }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex flex-col items-center p-4 rounded-xl border ${earned ? 'bg-white border-yellow-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}
        >
            <div className="text-4xl mb-2">{icon}</div>
            <h4 className="font-bold text-slate-700 text-sm text-center">{name}</h4>
            {description && <p className="text-xs text-slate-500 text-center mt-1">{description}</p>}
        </motion.div>
    );
};

export default Badge;
