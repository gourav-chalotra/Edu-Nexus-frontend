import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, subjectAPI, adminAPI } from '../../services/api';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    GraduationCap,
    BookOpen,
    Trash2,
    Plus,
    Search,
    BarChart2,
    Activity, // Import Activity icon
    X,
    Trophy,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalSubjects: 0,
        activeStudents: 0
    });
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterClass, setFilterClass] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    // Add Teacher Form State
    const [showAddTeacher, setShowAddTeacher] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: 'password123', assignedSubjects: [] });

    // Assign Subject Modal
    const [assigningTeacher, setAssigningTeacher] = useState(null);
    const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState('');
    const [selectedClassToAdd, setSelectedClassToAdd] = useState('10'); // Default class

    // Performance Modal
    const [viewingStudent, setViewingStudent] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [teachersRes, studentsRes, subjectsRes, statsRes] = await Promise.all([
                userAPI.getAllTeachers(),
                userAPI.getAllStudents(),
                subjectAPI.getAll(),
                adminAPI.getStats()
            ]);
            setTeachers(teachersRes.data.data);
            setStudents(studentsRes.data.data);
            setSubjects(subjectsRes.data.data);
            setStats(statsRes.data.data);
        } catch {
            toast.error('Failed to load dashboard data');
            // console.error(error); // Removed as per instruction to remove 'error' from catch
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await userAPI.createTeacher(newTeacher);
            toast.success('Teacher created successfully');
            setShowAddTeacher(false);
            setNewTeacher({ name: '', email: '', password: 'password123', assignedSubjects: [] });
            fetchData();
        } catch {
            toast.error('Failed to create teacher');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.deleteUser(id);
            toast.success('User deleted');
            fetchData();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const toggleSubjectAssignment = async (teacherId, subjectId, isAssigned) => {
        try {
            if (isAssigned) {
                await subjectAPI.unassignTeacher(teacherId, subjectId);
                toast.success('Subject unassigned');
            } else {
                await subjectAPI.assignTeacher(teacherId, subjectId);
                toast.success('Subject assigned');
            }
            fetchData(); // Refresh to show updated assignments
        } catch {
            toast.error('Failed to update assignment');
        }
    };

    const getFilteredStudents = () => {
        return students.filter(student => {
            const matchesClass = filterClass ? (student.classLevel && student.classLevel.toString() === filterClass.toString()) : true;
            const matchesSearch = (student.name || '').toLowerCase().includes(filterSearch.toLowerCase()) ||
                (student.email || '').toLowerCase().includes(filterSearch.toLowerCase());
            // Note: Subject filter currently just checks if the student is in a class that would take this subject, 
            // since we don't track individual subject enrollments in this simple mock.
            // But we can filter by the implicit class of the subject if needed.
            // For now, let's keep it simple: matchesClass && matchesSearch.
            // If the user selects "Physics", we assume they want to see students who study Physics.
            // In our system, all students study all subjects of their class. 
            // So if a subject is from Class 10, technically only Class 10 students study it.
            // We can check if the subject exists for the student's class.

            let matchesSubject = true;
            if (filterSubject) {
                // Find which classes have this subject
                const relevantSubjects = subjects.filter(s => s.name === filterSubject);
                const relevantClasses = relevantSubjects.map(s => s.classLevel);
                if (relevantClasses.length > 0) {
                    matchesSubject = relevantClasses.includes(student.classLevel);
                }
            }

            return matchesClass && matchesSearch && matchesSubject;
        });
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-display font-medium text-xl">Loading Admin Console...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 space-y-8 font-quicksand transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-[#6366f1] p-3 rounded-2xl shadow-inner border-2 border-[#4f46e5]">
                        <Users className="text-white w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-wide">Admin Portal</h1>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Manage Institution</p>
                    </div>
                </div>
                <button onClick={logout} className="text-[#ef4444] font-bold hover:bg-[#ef4444]/10 dark:hover:bg-[#ef4444]/20 px-6 py-3 rounded-xl transition-colors border-2 border-transparent hover:border-[#ef4444]/20 flex items-center gap-2">
                    <X className="w-5 h-5" /> Logout
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Total Students</h3>
                    <p className="text-4xl font-display font-black text-slate-800 dark:text-white drop-shadow-sm group-hover:scale-110 transition-transform">{stats.totalStudents}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Total Teachers</h3>
                    <p className="text-4xl font-display font-black text-[#6366f1] drop-shadow-sm group-hover:scale-110 transition-transform">{stats.totalTeachers}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">Active Subjects</h3>
                    <p className="text-4xl font-display font-black text-[#10b981] drop-shadow-sm group-hover:scale-110 transition-transform">{stats.totalSubjects}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-[#f97316] animate-pulse" />
                        <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">Active Students</h3>
                    </div>
                    <p className="text-4xl font-display font-black text-[#f97316] drop-shadow-sm group-hover:scale-110 transition-transform">{stats.activeStudents || 0}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow min-h-[500px] overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="flex border-b-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-colors border-r-[3px] border-slate-200 dark:border-slate-700 ${activeTab === 'teachers'
                            ? 'text-[#6366f1] dark:text-[#818cf8] bg-white dark:bg-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#6366f1]'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        <Users className={activeTab === 'teachers' ? 'animate-bounce' : ''} />
                        Directory
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-colors ${activeTab === 'students'
                            ? 'text-[#6366f1] dark:text-[#818cf8] bg-white dark:bg-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#6366f1]'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        <GraduationCap className={activeTab === 'students' ? 'animate-bounce' : ''} />
                        Performance
                    </button>
                </div>

                <div className="p-6 sm:p-8 flex-1">
                    {/* TEACHERS TAB */}
                    {activeTab === 'teachers' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black text-slate-800 dark:text-white">Teacher Directory</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage educators and their assignments</p>
                                </div>
                                <button
                                    onClick={() => setShowAddTeacher(true)}
                                    className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-6 py-3 rounded-xl font-bold border-b-4 border-[#0f766e] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Teacher
                                </button>
                            </div>

                            {showAddTeacher && (
                                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 cartoon-border">
                                    <form onSubmit={handleCreateTeacher} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-800 dark:text-slate-100 font-medium focus:ring-0 focus:border-[#6366f1] transition-colors"
                                                    value={newTeacher.name}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-800 dark:text-slate-100 font-medium focus:ring-0 focus:border-[#6366f1] transition-colors"
                                                    value={newTeacher.email}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Password</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newTeacher.password}
                                                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                                    className="w-full rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-800 dark:text-slate-100 font-medium focus:ring-0 focus:border-[#6366f1] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="bg-white dark:bg-slate-900 border-[3px] border-slate-200 dark:border-slate-700 p-5 rounded-2xl">
                                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Assign Subjects & Classes</label>
                                                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                    <select
                                                        className="flex-1 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] transition-colors"
                                                        value={selectedSubjectToAdd}
                                                        onChange={(e) => setSelectedSubjectToAdd(e.target.value)}
                                                    >
                                                        <option value="">Select Subject...</option>
                                                        {subjects.map(subject => (
                                                            <option key={subject.id} value={subject.id}>{subject.title}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        className="w-full sm:w-40 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] transition-colors"
                                                        value={selectedClassToAdd}
                                                        onChange={(e) => setSelectedClassToAdd(e.target.value)}
                                                    >
                                                        {[6, 7, 8, 9, 10].map(cls => (
                                                            <option key={cls} value={cls}>Class {cls}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedSubjectToAdd && selectedClassToAdd) {
                                                                const alreadyExists = newTeacher.assignedSubjects.some(
                                                                    s => s.subjectId === selectedSubjectToAdd && s.classLevel.toString() === selectedClassToAdd.toString()
                                                                );
                                                                if (!alreadyExists) {
                                                                    setNewTeacher({
                                                                        ...newTeacher,
                                                                        assignedSubjects: [
                                                                            ...newTeacher.assignedSubjects,
                                                                            { subjectId: selectedSubjectToAdd, classLevel: selectedClassToAdd }
                                                                        ]
                                                                    });
                                                                    setSelectedSubjectToAdd('');
                                                                } else {
                                                                    toast.error('Subject already assigned for this class');
                                                                }
                                                            }
                                                        }}
                                                        className="bg-[#6366f1] text-white px-5 py-3 rounded-xl hover:bg-[#4f46e5] font-bold border-b-4 border-[#4338ca] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                                    >
                                                        <Plus className="w-5 h-5" /> Add
                                                    </button>
                                                </div>

                                                <div className="border-[3px] border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-3 min-h-[100px] max-h-40 overflow-y-auto space-y-2">
                                                    {newTeacher.assignedSubjects.length === 0 ? (
                                                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 text-center py-4">No subjects assigned yet.</p>
                                                    ) : (
                                                        newTeacher.assignedSubjects.map((assignment, index) => {
                                                            const subject = subjects.find(s => s.id === assignment.subjectId);
                                                            return (
                                                                <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{subject?.title || assignment.subjectId}</span>
                                                                        <span className="text-xs font-bold bg-[#6366f1]/10 text-[#6366f1] dark:text-[#818cf8] px-2 py-1 rounded-md border border-[#6366f1]/20">Class {assignment.classLevel}</span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setNewTeacher({
                                                                                ...newTeacher,
                                                                                assignedSubjects: newTeacher.assignedSubjects.filter((_, i) => i !== index)
                                                                            });
                                                                        }}
                                                                        className="text-[#ef4444] hover:bg-[#ef4444]/10 p-1.5 rounded-lg transition-colors"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-end pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddTeacher(false)}
                                                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-[#6366f1] text-white px-8 py-3 rounded-xl font-bold border-b-4 border-[#4f46e5] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:border-b-4 disabled:active:translate-y-0 shadow-sm"
                                                disabled={newTeacher.assignedSubjects.length === 0}
                                            >
                                                Create Teacher
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="overflow-x-auto rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border bg-white dark:bg-slate-800">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b-[3px] border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Name</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Assigned Subjects</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[3px] divide-slate-100 dark:divide-slate-700/50">
                                        {teachers.map(teacher => (
                                            <tr key={teacher._id || teacher.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                                <td className="p-5 font-bold text-slate-900 dark:text-slate-100">{teacher.name}</td>
                                                <td className="p-5 font-medium text-slate-500 dark:text-slate-400">{teacher.email}</td>
                                                <td className="p-5">
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        {teacher.assignedSubjects && teacher.assignedSubjects.length > 0 ? (
                                                            teacher.assignedSubjects.map((assignment, index) => {
                                                                const subjectId = typeof assignment === 'string' ? assignment : assignment.subjectId;
                                                                const sub = subjects.find(s => s.id === subjectId);
                                                                return (
                                                                    <span key={index} className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] dark:text-[#818cf8] rounded-lg text-xs font-bold border-2 border-[#6366f1]/20">
                                                                        {sub ? sub.title : subjectId}
                                                                    </span>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 italic text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">No subjects assigned</span>
                                                        )}
                                                        <button
                                                            onClick={() => setAssigningTeacher(teacher)}
                                                            className="text-[#14b8a6] hover:text-[#0d9488] dark:hover:text-[#2dd4bf] text-xs font-bold underline ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Manage
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(teacher._id || teacher.id)}
                                                        className="text-slate-400 hover:text-white hover:bg-[#ef4444] transition-colors p-2.5 rounded-xl border-2 border-transparent hover:border-[#b91c1c] active:translate-y-1 shadow-sm"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* STUDENTS TAB */}
                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-display font-black text-slate-800 dark:text-white">Student Performance</h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Track progress and engagement</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto p-2 bg-slate-50 dark:bg-slate-900 border-[3px] border-slate-200 dark:border-slate-700 rounded-2xl cartoon-border">
                                    {/* Class Filter */}
                                    <select
                                        className="px-4 py-2.5 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:ring-0 focus:border-[#6366f1] transition-colors"
                                        onChange={(e) => setFilterClass(e.target.value)}
                                    >
                                        <option value="">All Classes</option>
                                        {[6, 7, 8, 9, 10].map(c => (
                                            <option key={c} value={c}>Class {c}</option>
                                        ))}
                                    </select>

                                    {/* Subject Filter */}
                                    <select
                                        className="px-4 py-2.5 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:ring-0 focus:border-[#6366f1] transition-colors"
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                    >
                                        <option value="">All Subjects</option>
                                        {[...new Set(subjects.map(s => s.name))].map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>

                                    <div className="relative flex-grow">
                                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search name or email..."
                                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-[3px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:ring-0 focus:border-[#6366f1] transition-colors"
                                            onChange={(e) => setFilterSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border bg-white dark:bg-slate-800">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b-[3px] border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Student</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Class</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-6">Level</th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                {filterSubject ? `${filterSubject} XP` : 'Total XP'}
                                            </th>
                                            <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[3px] divide-slate-100 dark:divide-slate-700/50">
                                        {getFilteredStudents().map(student => (
                                            <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-[3px] border-slate-200 dark:border-slate-600 cartoon-border shrink-0 text-3xl flex items-center justify-center">
                                                            {student.avatar || '🎓'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">{student.name}</div>
                                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        Class {student.classLevel || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="inline-flex items-center bg-[#f59e0b] border-b-4 border-[#b45309] rounded-full px-3 py-1 shadow-sm pop-shadow">
                                                        <Trophy className="w-4 h-4 text-white fill-white mr-1.5 drop-shadow-sm" />
                                                        <span className="text-white font-black text-sm drop-shadow-sm leading-none">
                                                            {student.level || 1}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-5 font-black text-[#6366f1] dark:text-[#818cf8] text-lg lg:text-xl">
                                                    {student.xp || 0} <span className="text-xs font-bold text-slate-400">XP</span>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button
                                                        onClick={() => setViewingStudent(student)}
                                                        className="bg-[#6366f1] text-white hover:bg-[#4f46e5] font-bold text-sm px-4 py-2.5 rounded-xl border-b-[3px] border-[#4338ca] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-end gap-2 ml-auto shadow-sm"
                                                    >
                                                        <Activity className="w-4 h-4" />
                                                        Stats
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {getFilteredStudents().length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center text-slate-400 dark:text-slate-500 font-bold text-lg bg-slate-50 dark:bg-slate-900/50">
                                                    No students found matching filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}

            {/* Assign Subject Modal */}
            <AnimatePresence>
                {assigningTeacher && (
                    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden cartoon-border pop-shadow border-[4px] border-slate-200 dark:border-slate-700"
                        >
                            <div className="p-6 border-b-[3px] border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                                <div>
                                    <h3 className="text-xl font-display font-black text-slate-800 dark:text-white">Assign Subjects</h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1">{assigningTeacher.name}</p>
                                </div>
                                <button onClick={() => setAssigningTeacher(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-200 dark:bg-slate-700 p-2 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3 bg-white dark:bg-slate-800">
                                {subjects.map(subject => {
                                    const isAssigned = assigningTeacher.assignedSubjects?.some(
                                        s => (s.subjectId || s) === subject.id
                                    );
                                    return (
                                        <div
                                            key={subject.id}
                                            onClick={() => toggleSubjectAssignment(assigningTeacher.id, subject.id, isAssigned)}
                                            className={`flex items-center p-4 rounded-2xl cursor-pointer border-[3px] transition-all cartoon-border ${isAssigned
                                                ? 'bg-[#10b981]/10 border-[#10b981] pop-shadow'
                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-colors ${isAssigned ? 'bg-[#10b981] border-[#059669]' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                                }`}>
                                                {isAssigned && <Check className="w-4 h-4 text-white font-bold" strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <span className={`block font-bold text-lg leading-tight ${isAssigned ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {subject.title}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                                                    {subject.class ? `Class ${subject.class}` : `Class ${subject.classLevel || 'N/A'}`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-6 border-t-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end">
                                <button onClick={() => setAssigningTeacher(null)} className="bg-[#6366f1] text-white px-8 py-3 rounded-xl font-bold border-b-4 border-[#4f46e5] active:border-b-0 active:translate-y-1 transition-all shadow-sm w-full">
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Student Details Modal */}
            <AnimatePresence>
                {viewingStudent && (
                    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden cartoon-border pop-shadow border-[4px] border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b-[3px] border-[#4f46e5] flex justify-between items-center bg-[#6366f1] text-white relative overflow-hidden">
                                {/* Decorative background elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c084fc]/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="text-5xl bg-white/20 p-4 rounded-2xl border-2 border-white/30 shadow-inner">
                                        {viewingStudent.avatar || '🎓'}
                                    </div>
                                    <div>
                                        <h3 className="font-display font-black text-3xl drop-shadow-sm">{viewingStudent.name}</h3>
                                        <p className="text-indigo-100 font-bold mt-1 bg-black/20 px-3 py-1 rounded-lg inline-block text-sm">{viewingStudent.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingStudent(null)} className="text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-2 rounded-xl transition-colors relative z-10">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-900 border-b-[3px] border-slate-200 dark:border-slate-700 divide-x-[3px] divide-slate-200 dark:divide-slate-700">
                                <div className="p-6 text-center flex flex-col items-center justify-center">
                                    <Activity className="w-8 h-8 text-[#6366f1] mb-2" />
                                    <div className="text-3xl font-display font-black text-[#6366f1] drop-shadow-sm leading-none mb-1">{viewingStudent.xp || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total XP</div>
                                </div>
                                <div className="p-6 text-center flex flex-col items-center justify-center">
                                    <Trophy className="w-8 h-8 text-[#f59e0b] mb-2" />
                                    <div className="text-3xl font-display font-black text-[#f59e0b] drop-shadow-sm leading-none mb-1">{viewingStudent.level || 1}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level</div>
                                </div>
                                <div className="p-6 text-center flex flex-col items-center justify-center">
                                    <div className="text-3xl font-display font-black text-[#10b981] drop-shadow-sm leading-none mb-1 flex items-center justify-center gap-1">
                                        {viewingStudent.streak || 0} <span className="text-2xl">🔥</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Current Streak</div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto bg-white dark:bg-slate-800">
                                <h4 className="font-display font-black text-xl text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-[#14b8a6]" />
                                    Recent Activity
                                </h4>

                                {/* Empty state for activity */}
                                <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-[3px] border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">No activity recorded yet</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                                        Detailed activity logs will appear here once the student completes lessons and quizzes.
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 border-t-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end">
                                <button onClick={() => setViewingStudent(null)} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 text-slate-700 px-8 py-3 rounded-xl font-bold border-b-4 border-slate-300 dark:border-slate-800 active:border-b-0 active:translate-y-1 transition-all">
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
