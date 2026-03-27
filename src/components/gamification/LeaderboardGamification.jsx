import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../../services/api';
import { Trophy, Medal, Crown } from 'lucide-react';
import clsx from 'clsx';

const Leaderboard = ({ limit = 5, showFull = false }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await leaderboardAPI.get(limit);
                setLeaders(response.data.data);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        // Refresh every minute for "live" feel
        const interval = setInterval(fetchLeaderboard, 60000);
        return () => clearInterval(interval);
    }, [limit]);

    if (loading) return <div className="text-center py-4 text-slate-500">Loading rankings...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-200" /> Leaderboard
                </h3>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Top {leaders.length}</span>
            </div>

            <div className="divide-y divide-slate-100">
                {leaders.map((student, index) => {
                    const rank = index + 1;
                    return (
                        <div key={student.id} className={clsx("p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors",
                            rank === 1 ? "bg-amber-50/50" : "")}>
                            <div className="font-bold text-slate-400 w-6 text-center">
                                {rank === 1 ? <Crown size={20} className="text-amber-500 mx-auto" /> :
                                    rank === 2 ? <Medal size={20} className="text-slate-400 mx-auto" /> :
                                        rank === 3 ? <Medal size={20} className="text-amber-700 mx-auto" /> :
                                            rank}
                            </div>

                            <div className="relative">
                                <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {rank <= 3 && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">
                                        {rank}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm truncate">{student.name}</h4>
                                <p className="text-xs text-slate-500">{student.level ? `Level ${student.level}` : 'Rookie'}</p>
                            </div>

                            <div className="text-right">
                                <span className="font-bold text-indigo-600 text-sm block">{student.xp} XP</span>
                            </div>
                        </div>
                    );
                })}

                {leaders.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">No rankings yet. Be the first!</div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
