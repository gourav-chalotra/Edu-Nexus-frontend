import React from 'react';
import LeaderboardComponent from '../components/gamification/LeaderboardGamification';

const Leaderboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 text-center mb-8">
                    Global Leaderboard
                </h1>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    Check out the top performers across Edu Nexus. Learn, earn XP, and climb the ranks to become a champion!
                </p>
                <LeaderboardComponent limit="all" showFull={true} />
            </div>
        </div>
    );
};

export default Leaderboard;
