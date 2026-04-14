import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { userAPI, quizAPI } from '../../services/api';
import { BarChart2, Users, Search, Filter, ArrowUpDown, Award, Zap, Layout, X, Calendar, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const { curriculum } = useCurriculum();

    // Filter subjects assigned to this teacher
    const allSubjects = Object.values(curriculum);
    const subjects = useMemo(() => {
        if (!user || !user.assignedSubjects || user.assignedSubjects.length === 0) return allSubjects;
        return allSubjects.filter(s => 
            user.assignedSubjects.some(as => as.subjectId === s.id)
        );
    }, [curriculum, user, allSubjects]);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter & Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [sortBy, setSortBy] = useState('xp-desc'); // 'xp-desc' | 'xp-asc' | 'level-desc' | 'name-asc'

    // Report Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentAttempts, setStudentAttempts] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState(false);

    // Get unique classes from assigned subjects or students
    const availableClasses = useMemo(() => {
        if (user?.assignedSubjects && user.assignedSubjects.length > 0) {
            return [...new Set(user.assignedSubjects.map(as => as.classLevel))].filter(Boolean).sort((a, b) => a - b);
        }
        return [...new Set(students.map(s => s.classLevel))].filter(Boolean).sort((a, b) => a - b);
    }, [user, students]);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const res = await userAPI.getAllStudents();
                setStudents(res.data.data);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Filtered and Sorted Students
    const filteredStudents = useMemo(() => {
        let result = [...students];

        // Search filter
        if (searchTerm) {
            result = result.filter(s => 
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Class filter
        if (classFilter !== 'all') {
            result = result.filter(s => s.classLevel?.toString() === classFilter.toString());
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'xp-desc': return (b.xp || 0) - (a.xp || 0);
                case 'xp-asc': return (a.xp || 0) - (b.xp || 0);
                case 'level-desc': return (b.level || 1) - (a.level || 1);
                case 'name-asc': return a.name.localeCompare(b.name);
                default: return 0;
            }
        });

        return result;
    }, [students, searchTerm, classFilter, sortBy]);

    const handleViewReport = async (student) => {
        setSelectedStudent(student);
        setShowReportModal(true);
        setIsReportLoading(true);
        try {
            const res = await quizAPI.getStudentAttempts(student.id || student._id);
            setStudentAttempts(res.data.data);
        } catch (error) {
            console.error("Failed to fetch student report", error);
        } finally {
            setIsReportLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 md:p-8 font-body text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border-[3px] border-slate-700/50 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border-2 border-indigo-400/50 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-white font-black text-2xl drop-shadow-md">{user?.name?.charAt(0) || 'T'}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-black text-white tracking-tight mb-1">Teacher Dashboard</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 font-bold">Welcome back, {user?.name}</span>
                                <span className="h-4 w-[2px] bg-slate-700"></span>
                                <span className="text-indigo-400 font-black text-sm uppercase tracking-wider">
                                    Assigned Subjects: {subjects.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <button onClick={logout} className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-all border-2 border-red-500/20 hover:border-red-500/40 flex items-center gap-2">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-slate-800/40 p-6 rounded-3xl border-2 border-slate-700/50 flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Students</p>
                            <p className="text-2xl font-black text-white">{students.length}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-3xl border-2 border-slate-700/50 flex items-center gap-4 hover:border-amber-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. XP</p>
                            <p className="text-2xl font-black text-white">
                                {students.length ? Math.round(students.reduce((acc, s) => acc + (s.xp || 0), 0) / students.length) : 0}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-3xl border-2 border-slate-700/50 flex items-center gap-4 hover:border-emerald-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Top Level</p>
                            <p className="text-2xl font-black text-white">{students.length ? Math.max(...students.map(s => s.level || 1)) : 1}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/40 p-6 rounded-3xl border-2 border-slate-700/50 flex items-center gap-4 hover:border-purple-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Layout size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Classes</p>
                            <p className="text-2xl font-black text-white">{availableClasses.length}</p>
                        </div>
                    </div>
                </div>

                {/* Performance Management Section */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border-[3px] border-slate-700/50 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                    
                    {/* Toolbar */}
                    <div className="p-8 border-b-2 border-slate-700/50 flex flex-col lg:flex-row gap-6 justify-between items-center bg-slate-800/30">
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-indigo-500 focus:ring-0 text-white font-bold transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border-2 border-slate-700">
                                <Filter size={18} className="text-slate-500" />
                                <span className="text-sm font-bold text-slate-400 whitespace-nowrap">Class:</span>
                                <select 
                                    className="bg-transparent border-none text-white font-black text-sm focus:ring-0 cursor-pointer outline-none"
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                >
                                    <option value="all" className="bg-slate-800">All Classes</option>
                                    {availableClasses.map(cls => (
                                        <option key={cls} value={cls} className="bg-slate-800">Class {cls}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border-2 border-slate-700">
                                <ArrowUpDown size={18} className="text-slate-500" />
                                <span className="text-sm font-bold text-slate-400 whitespace-nowrap">Sort By:</span>
                                <select 
                                    className="bg-transparent border-none text-white font-black text-sm focus:ring-0 cursor-pointer outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="xp-desc" className="bg-slate-800">Highest XP</option>
                                    <option value="xp-asc" className="bg-slate-800">Lowest XP</option>
                                    <option value="level-desc" className="bg-slate-800">Highest Level</option>
                                    <option value="name-asc" className="bg-slate-800">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/30 border-b-2 border-slate-700/50">
                                    <tr>
                                        <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-slate-500">Rank</th>
                                        <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-slate-500">Student Profile</th>
                                        <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-slate-500">Academic Info</th>
                                        <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-slate-500">Performance</th>
                                        <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-slate-500 text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-700/30">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id || student._id} className="hover:bg-slate-700/20 transition-all group">
                                            <td className="p-6">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                                                    index === 0 ? 'bg-amber-500/20 text-amber-500 border-2 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                                                    index === 1 ? 'bg-slate-300/20 text-slate-300 border-2 border-slate-300/30' :
                                                    index === 2 ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500/30' :
                                                    'text-slate-500'
                                                }`}>
                                                    #{index + 1}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:border-indigo-500/50 transition-all duration-300">
                                                        {student.avatar || '🎓'}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-white text-lg group-hover:text-indigo-400 transition-colors">{student.name}</div>
                                                        <div className="text-sm font-bold text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-black border-2 border-indigo-500/20">Class {student.classLevel || 'N/A'}</span>
                                                        {student.stream && (
                                                            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-black border-2 border-purple-500/20">{student.stream}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-500 ml-1">{student.school || 'EduNexus Academy'}</div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Points</div>
                                                        <div className="text-xl font-black text-indigo-400 flex items-center gap-2">
                                                            <Zap size={16} fill="currentColor" />
                                                            {student.xp?.toLocaleString() || 0}
                                                        </div>
                                                    </div>
                                                    <div className="h-10 w-[2px] bg-slate-700/50"></div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Level</div>
                                                        <div className="text-xl font-black text-amber-500 flex items-center gap-2">
                                                            <Award size={16} />
                                                            {student.level || 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <div className="flex items-center gap-2 text-emerald-400 font-black mb-1">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                        {student.streak || 0} Day Streak
                                                    </div>
                                                    <button 
                                                        onClick={() => handleViewReport(student)}
                                                        className="text-indigo-400 hover:text-indigo-300 font-bold text-sm underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-500 transition-all"
                                                    >
                                                        Full Report
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center">
                                                <div className="bg-slate-900/50 rounded-[2rem] p-12 border-2 border-dashed border-slate-700 max-w-md mx-auto">
                                                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔍</div>
                                                    <h3 className="text-xl font-black text-white mb-2">No students found</h3>
                                                    <p className="text-slate-500 font-bold">Try adjusting your filters or search terms to find what you're looking for.</p>
                                                    <button 
                                                        onClick={() => {setSearchTerm(''); setClassFilter('all');}}
                                                        className="mt-6 text-indigo-400 font-black hover:text-indigo-300 transition-colors"
                                                    >
                                                        Clear All Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-[3rem] border-[3px] border-slate-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-8 border-b-2 border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
                            <div className="flex items-center gap-5">
                                <div className="text-4xl w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-slate-700 shadow-inner">
                                    {selectedStudent?.avatar || '🎓'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-black text-white">{selectedStudent?.name}'s Progress Report</h2>
                                    <p className="text-indigo-400 font-bold text-sm tracking-wide">Academic Monitoring Dashboard</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowReportModal(false)}
                                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center border-2 border-slate-700 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            
                            {/* Detailed Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Zap className="text-indigo-400" size={20} />
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">XP Points</h3>
                                    </div>
                                    <p className="text-3xl font-black text-white">{selectedStudent?.xp?.toLocaleString() || 0} <span className="text-lg text-slate-500">XP</span></p>
                                    <div className="mt-4 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${(selectedStudent?.xp % 1000) / 10}%` }}></div>
                                    </div>
                                    <p className="mt-2 text-[10px] font-black text-slate-500 uppercase">Progress to Next Level</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Award className="text-amber-500" size={20} />
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Global Rank</h3>
                                    </div>
                                    <p className="text-3xl font-black text-white">#{selectedStudent?.rank || '--'}</p>
                                    <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">In Level {selectedStudent?.level || 1}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BookOpen className="text-emerald-400" size={20} />
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Chapters</h3>
                                    </div>
                                    <p className="text-3xl font-black text-white">{selectedStudent?.completedChapters?.length || 0}</p>
                                    <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Curriculum Progress</p>
                                </div>
                            </div>

                            {/* Quiz Attempts History */}
                            <div>
                                <h3 className="text-xl font-display font-black text-white mb-6 flex items-center gap-3">
                                    <BarChart2 className="text-indigo-400" />
                                    Quiz Performance History
                                </h3>
                                
                                {isReportLoading ? (
                                    <div className="p-20 flex flex-col items-center justify-center gap-4 bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-700">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                                        <p className="font-bold text-slate-500">Retrieving academic records...</p>
                                    </div>
                                ) : studentAttempts.length > 0 ? (
                                    <div className="rounded-[2rem] overflow-hidden border-2 border-slate-800">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-800/50">
                                                <tr>
                                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-6">Subject</th>
                                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Chapter</th>
                                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Score</th>
                                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pr-6 text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-2 divide-slate-800/50 bg-slate-800/20">
                                                {studentAttempts.map((attempt) => (
                                                    <tr key={attempt.id || attempt._id} className="hover:bg-slate-800/40 transition-colors group">
                                                        <td className="p-4 pl-6 font-bold text-slate-200">
                                                            {curriculum[attempt.subjectId]?.name || 'Social Science'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-bold text-white text-sm">
                                                                {curriculum[attempt.subjectId]?.chapters?.find(ch => ch.id === attempt.chapterId)?.title || `Chapter ${attempt.chapterId}`}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className={`font-black ${attempt.score >= (attempt.totalPoints * 0.6) ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                    {attempt.score} / {attempt.totalPoints}
                                                                </span>
                                                                <div className="w-20 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                                                    <div 
                                                                        className={`h-full ${attempt.score >= (attempt.totalPoints * 0.6) ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${(attempt.score / attempt.totalPoints) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {attempt.passed ? (
                                                                <span className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                                                                    <CheckCircle size={14} /> PASSED
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-2 text-red-400 text-xs font-black">
                                                                    <XCircle size={14} /> FAILED
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 pr-6 text-right text-xs font-bold text-slate-500">
                                                            {new Date(attempt.completedAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-16 flex flex-col items-center justify-center bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-700 text-center">
                                        <div className="text-4xl mb-4">📓</div>
                                        <h4 className="text-lg font-black text-white">No quiz history available</h4>
                                        <p className="text-slate-500 font-bold max-w-xs mx-auto mt-1">This student hasn't completed any quizzes yet in the current subjects.</p>
                                    </div>
                                )}
                            </div>

                            {/* Badges Section */}
                            <div>
                                <h3 className="text-xl font-display font-black text-white mb-6 flex items-center gap-3">
                                    <Award className="text-amber-500" />
                                    Earned Badges
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {selectedStudent?.badges?.length > 0 ? (
                                        selectedStudent.badges.map((badge, idx) => (
                                            <div key={idx} className="bg-slate-800/50 px-5 py-3 rounded-2xl border-2 border-slate-700/50 flex items-center gap-3 hover:border-amber-500/30 transition-all group">
                                                <span className="text-2xl group-hover:scale-125 transition-transform">{badge.icon || '🏅'}</span>
                                                <div>
                                                    <p className="text-xs font-black text-white leading-tight">{badge.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Achieved!</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-3 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 font-bold text-sm">
                                            No badges earned yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t-2 border-slate-800 bg-slate-900/80 sticky bottom-0 flex justify-end gap-4">
                            <button 
                                onClick={() => setShowReportModal(false)}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl border-2 border-slate-700 transition-all uppercase tracking-widest text-xs"
                            >
                                Close Report
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all uppercase tracking-widest text-xs flex items-center gap-2"
                            >
                                Print Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
