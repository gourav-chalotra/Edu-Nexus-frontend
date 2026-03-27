import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { userAPI } from '../../services/api';
import { Upload, FileText, CheckCircle, X, Youtube, Plus, Edit3, Trash2, Image as ImageIcon, Users, BookOpen, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const {
        curriculum,
        updateChapterVideo,
        addChapterAttachment,
        updateTeacherNote,
        addChapter,
        updateChapterDetails,
        addQuiz
    } = useCurriculum();

    // Filter subjects assigned to this teacher
    // In a real app, this would be filtered by the backend or context.
    // For this mock, we'll check user.assignedSubjects or show all if none (fallback)
    const allSubjects = Object.values(curriculum);
    const subjects = user.assignedSubjects
        ? allSubjects.filter(s => user.assignedSubjects.includes(s.id))
        : allSubjects;

    const [activeTab, setActiveTab] = useState('content'); // 'content' | 'performance'
    const [students, setStudents] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [modalMode, setModalMode] = useState('notes');

    // Selection States
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');

    // Form States
    const [videoUrl, setVideoUrl] = useState('');
    const [attachmentName, setAttachmentName] = useState('');
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');
    const [teacherNote, setTeacherNote] = useState('');

    // Quiz Builder State
    const [questions, setQuestions] = useState([]);

    // Chapter Detail States
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterDesc, setChapterDesc] = useState('');
    const [chapterTopics, setChapterTopics] = useState('');

    const fileInputRef = useRef(null);

    // Initialize selection
    useEffect(() => {
        if (!selectedSubjectId && subjects.length > 0) {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    useEffect(() => {
        if (selectedSubjectId) {
            const subject = curriculum[selectedSubjectId];
            if (subject && subject.chapters.length > 0) {
                const isValid = subject.chapters.some(ch => ch.id === selectedChapterId);
                if (!isValid) {
                    setSelectedChapterId(subject.chapters[0].id);
                }
            } else {
                setSelectedChapterId('');
            }
        }
    }, [selectedSubjectId, curriculum, selectedChapterId]);

    // Fetch students for performance view
    useEffect(() => {
        if (activeTab === 'performance') {
            const fetchStudents = async () => {
                try {
                    const res = await userAPI.getAllStudents();
                    setStudents(res.data.data);
                } catch (error) {
                    console.error("Failed to fetch students", error);
                }
            };
            fetchStudents();
        }
    }, [activeTab]);

    const openModal = (mode) => {
        setModalMode(mode);
        setShowUploadModal(true);

        const chapter = getSelectedChapter();

        if (mode === 'teacher_note') {
            setTeacherNote(chapter?.teacherNote || '');
        } else if (mode === 'edit_chapter') {
            if (chapter) {
                setChapterTitle(chapter.title);
                setChapterDesc(chapter.description);
                setChapterTopics(chapter.topics?.join('\n') || '');
            }
        } else if (mode === 'create_chapter') {
            setChapterTitle('');
            setChapterDesc('');
            setChapterTopics('');
        } else if (mode === 'quiz') {
            setQuizTitle(chapter ? `${chapter.title} Quiz` : '');
            setQuestions([
                { id: 1, type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '', points: 100, image: null }
            ]);
        }
    };

    const getSelectedChapter = () => {
        return curriculum[selectedSubjectId]?.chapters.find(ch => ch.id === selectedChapterId);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentFile(e.target.files[0]);
            if (!attachmentName) {
                setAttachmentName(e.target.files[0].name);
            }
        }
    };

    // Quiz Builder Functions
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                type: 'mcq',
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                points: 100,
                image: null
            }
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleQuestionImageUpload = async (e, qIndex) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateQuestion(qIndex, 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubjectId) {
            toast.error('Please select a subject');
            return;
        }

        if (modalMode !== 'create_chapter' && !selectedChapterId) {
            toast.error('Please select a chapter');
            return;
        }

        try {
            if (modalMode === 'video') {
                let finalUrl = videoUrl;
                if (videoUrl.includes('watch?v=')) {
                    finalUrl = videoUrl.replace('watch?v=', 'embed/');
                } else if (videoUrl.includes('youtu.be/')) {
                    finalUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
                }
                updateChapterVideo(selectedSubjectId, selectedChapterId, finalUrl);
                toast.success('Video lesson updated!');
            }
            else if (modalMode === 'notes') {
                if (!attachmentFile) {
                    toast.error('Please select a file to upload');
                    return;
                }
                const newAttachment = {
                    id: Date.now().toString(),
                    name: attachmentName,
                    type: attachmentFile.name.split('.').pop().toUpperCase(),
                    url: '#'
                };
                addChapterAttachment(selectedSubjectId, selectedChapterId, newAttachment);
                toast.success('Attachment added!');
                setAttachmentFile(null);
            }
            else if (modalMode === 'teacher_note') {
                updateTeacherNote(selectedSubjectId, selectedChapterId, teacherNote);
                toast.success('Teacher note updated!');
            }
            else if (modalMode === 'create_chapter') {
                const newChapter = {
                    title: chapterTitle,
                    description: chapterDesc,
                    topics: chapterTopics.split('\n').filter(t => t.trim() !== '')
                };
                addChapter(selectedSubjectId, newChapter);
                toast.success('New chapter created!');
            }
            else if (modalMode === 'edit_chapter') {
                const updates = {
                    title: chapterTitle,
                    description: chapterDesc,
                    topics: chapterTopics.split('\n').filter(t => t.trim() !== '')
                };
                updateChapterDetails(selectedSubjectId, selectedChapterId, updates);
                toast.success('Chapter details updated!');
            }
            else if (modalMode === 'quiz') {
                if (questions.length === 0) {
                    toast.error('Please add at least one question');
                    return;
                }

                // Validate questions
                for (let i = 0; i < questions.length; i++) {
                    const q = questions[i];
                    if (!q.question.trim()) {
                        toast.error(`Question ${i + 1} is empty`);
                        return;
                    }
                    if (!q.correctAnswer.trim()) {
                        toast.error(`Question ${i + 1} needs a correct answer`);
                        return;
                    }
                    if (q.type === 'mcq' && q.options.some(o => !o.trim())) {
                        toast.error(`All options for Question ${i + 1} must be filled`);
                        return;
                    }
                }

                const newQuiz = {
                    id: Date.now().toString(),
                    title: quizTitle,
                    questions: questions.map((q, i) => ({
                        id: i + 1,
                        type: q.type,
                        question: q.question,
                        options: q.type === 'mcq' ? q.options : [],
                        correctAnswer: q.correctAnswer,
                        points: parseInt(q.points) || 100,
                        image: q.image
                    }))
                };

                addQuiz(selectedSubjectId, selectedChapterId, newQuiz);
                toast.success('Quiz created successfully!');
                setShowUploadModal(false);
            }

            if (modalMode !== 'quiz') {
                setShowUploadModal(false);
            }
            setVideoUrl('');
            setAttachmentName('');
            setQuizTitle('');

        } catch (error) {
            console.error(error);
            toast.error('Failed to update content');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 font-quicksand transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#6366f1] p-3 rounded-2xl shadow-inner border-[3px] border-[#4f46e5]">
                            <span className="text-white font-black text-xl drop-shadow-sm">{user?.name?.charAt(0) || 'T'}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-wide">Teacher Dashboard</h1>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="text-[#ef4444] font-bold hover:bg-[#ef4444]/10 dark:hover:bg-[#ef4444]/20 px-6 py-3 rounded-xl transition-colors border-2 border-transparent hover:border-[#ef4444]/20 flex items-center gap-2">
                        Logout
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border-[3px] border-slate-200 dark:border-slate-700 cartoon-border pop-shadow overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b-[3px] border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-colors border-r-[3px] border-slate-200 dark:border-slate-700 ${activeTab === 'content'
                                ? 'text-[#6366f1] dark:text-[#818cf8] bg-white dark:bg-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#6366f1]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <BookOpen className={activeTab === 'content' ? 'animate-bounce' : ''} />
                            Content Management
                        </button>
                        <button
                            onClick={() => setActiveTab('performance')}
                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-colors ${activeTab === 'performance'
                                ? 'text-[#6366f1] dark:text-[#818cf8] bg-white dark:bg-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#6366f1]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <BarChart2 className={activeTab === 'performance' ? 'animate-bounce' : ''} />
                            Student Performance
                        </button>
                    </div>

                    <div className="p-6 sm:p-8 flex-1">

                        {/* Content Management Tab */}
                        {activeTab === 'content' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-slate-800">Manage Curriculum</h2>
                                        <div className="text-sm text-slate-500">
                                            Assigned Subjects: {subjects.length}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => openModal('create_chapter')} className="bg-[#6366f1] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#4f46e5] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><Plus className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Add New Chapter</h3>
                                            <p className="font-bold text-white/80 mt-1">Create a new unit for {curriculum[selectedSubjectId]?.name || 'a subject'}</p>
                                        </button>

                                        <button onClick={() => openModal('edit_chapter')} className="bg-[#f97316] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#ea580c] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><Edit3 className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Edit Details</h3>
                                            <p className="font-bold text-white/80 mt-1">Update title & topics</p>
                                        </button>

                                        <button onClick={() => openModal('video')} className="bg-[#ef4444] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#dc2626] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><Youtube className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Update Video</h3>
                                            <p className="font-bold text-white/80 mt-1">Add YouTube links</p>
                                        </button>

                                        <button onClick={() => openModal('teacher_note')} className="bg-[#3b82f6] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#2563eb] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><FileText className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Teacher's Note</h3>
                                            <p className="font-bold text-white/80 mt-1">Add tips for students</p>
                                        </button>

                                        <button onClick={() => openModal('quiz')} className="bg-[#8b5cf6] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#7c3aed] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><Upload className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Create Quiz</h3>
                                            <p className="font-bold text-white/80 mt-1">MCQ & Fill-in Builder</p>
                                        </button>

                                        <button onClick={() => openModal('notes')} className="bg-[#10b981] p-6 rounded-[2rem] shadow-sm border-b-[5px] border-[#059669] active:border-b-0 active:translate-y-[5px] text-left group transition-all">
                                            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border-[3px] border-white/20"><Upload className="text-white w-7 h-7" strokeWidth={3} /></div>
                                            <h3 className="font-display font-black text-white text-xl">Upload Attachment</h3>
                                            <p className="font-bold text-white/80 mt-1">Share PDFs or docs</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Context Sidebar */}
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border-[3px] border-slate-200 dark:border-slate-700 h-fit cartoon-border">
                                    <h3 className="font-display font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-[#10b981]" />
                                        Current Selection
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Subject</label>
                                            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1 text-lg">
                                                {curriculum[selectedSubjectId]?.name || 'Loading...'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Chapter</label>
                                            <div className="font-bold text-slate-800 dark:text-slate-200 mt-1 text-lg">
                                                {getSelectedChapter()?.title || 'No Chapters Created'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</label>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {getSelectedChapter()?.content?.videoUrl ? (
                                                    <span className="px-3 py-1 bg-[#10b981]/10 border-2 border-[#10b981]/20 text-[#10b981] text-xs font-bold rounded-lg">Video Ready</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg">No Video</span>
                                                )}
                                                {getSelectedChapter()?.quiz ? (
                                                    <span className="px-3 py-1 bg-[#8b5cf6]/10 border-2 border-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-bold rounded-lg">Quiz Active</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg">No Quiz</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-xl font-display font-black text-slate-800 dark:text-white">Student Progress Report</h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Overview of student performance in your subjects</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-2xl border-[3px] border-slate-200 dark:border-slate-700 cartoon-border bg-white dark:bg-slate-800">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b-[3px] border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Student</th>
                                                <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Level</th>
                                                <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Total XP</th>
                                                <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-[3px] divide-slate-100 dark:divide-slate-700/50">
                                            {students.map(student => (
                                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden border-[3px] border-slate-200 dark:border-slate-600 flex items-center justify-center text-xl">
                                                                {student.avatar || '🎓'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{student.name}</div>
                                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{student.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="px-3 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded-lg text-xs font-bold border-2 border-[#f59e0b]/20">
                                                            Lvl {student.level || 1}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 font-black text-[#6366f1] dark:text-[#818cf8]">
                                                        {student.xp || 0} XP
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button className="text-[#14b8a6] hover:text-[#0d9488] font-bold text-sm underline">View Details</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {students.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold">
                                                        No students found.
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
            </div>

            {/* Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-900/90 backdrop-blur-sm min-h-screen">
                    <div className={`bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full ${modalMode === 'quiz' ? 'max-w-4xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border-[3px] border-slate-200 dark:border-slate-600 cartoon-border flex flex-col`}>
                        <div className="p-6 border-b-[3px] border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 flex justify-between items-center rounded-t-[2rem] shrink-0 sticky top-0 z-10">
                            <h3 className="font-display font-black text-xl text-slate-800 dark:text-white capitalize tracking-wide">
                                {modalMode === 'quiz' ? 'Create Quiz' : modalMode.replace('_', ' ')}
                            </h3>
                            <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Subject & Chapter Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Subject</label>
                                    <select
                                        className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none cursor-pointer"
                                        value={selectedSubjectId}
                                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    >
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id} className="font-bold">{subject.name || subject.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {modalMode !== 'create_chapter' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Chapter</label>
                                        <select
                                            className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none cursor-pointer"
                                            value={selectedChapterId}
                                            onChange={(e) => setSelectedChapterId(e.target.value)}
                                        >
                                            {curriculum[selectedSubjectId]?.chapters.map(chapter => (
                                                <option key={chapter.id} value={chapter.id} className="font-bold">{chapter.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Standard Modes */}
                            {(modalMode === 'create_chapter' || modalMode === 'edit_chapter') && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Chapter Title</label>
                                        <input type="text" className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="e.g. Chapter 4: Optics" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Description</label>
                                        <textarea className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" rows="3" placeholder="Overview..." value={chapterDesc} onChange={(e) => setChapterDesc(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Topics (One per line)</label>
                                        <textarea className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" rows="4" placeholder="Topic 1&#10;Topic 2" value={chapterTopics} onChange={(e) => setChapterTopics(e.target.value)} />
                                    </div>
                                </>
                            )}

                            {modalMode === 'teacher_note' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Note for Students</label>
                                    <textarea className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-blue-50/50 dark:bg-[#3b82f6]/10 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#3b82f6] focus:bg-white dark:focus:bg-[#3b82f6]/20 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" rows="4" placeholder="Add important tips..." value={teacherNote} onChange={(e) => setTeacherNote(e.target.value)} />
                                </div>
                            )}

                            {modalMode === 'video' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">YouTube Video Link</label>
                                    <div className="relative">
                                        <Youtube className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" size={18} />
                                        <input type="text" className="w-full pl-11 px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#ef4444] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" placeholder="YouTube URL..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            {modalMode === 'notes' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">Attachment Title</label>
                                        <input type="text" className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-700 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest ml-1">File</label>
                                        <div className="border-[3px] border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                                            <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="text-slate-400 dark:text-slate-300" size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{attachmentFile ? attachmentFile.name : "Click to select file"}</p>
                                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Quiz Builder UI */}
                            {modalMode === 'quiz' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Quiz Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                            value={quizTitle}
                                            onChange={(e) => setQuizTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {questions.map((q, qIndex) => (
                                            <div key={qIndex} className="p-6 border-[3px] border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 relative group shadow-sm cartoon-border">
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Question Type</label>
                                                        <select
                                                            className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-sm focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors outline-none"
                                                            value={q.type}
                                                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                                        >
                                                            <option value="mcq">Multiple Choice</option>
                                                            <option value="fill-in">Fill in the Blanks</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Points</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold text-sm focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors outline-none"
                                                            value={q.points}
                                                            onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Question Text</label>
                                                    <textarea
                                                        className="w-full px-4 py-3 border-[3px] border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold focus:ring-0 focus:border-[#6366f1] focus:bg-white dark:focus:bg-slate-800 transition-colors outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                        rows="2"
                                                        value={q.question}
                                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                        placeholder="Enter question here..."
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                                                        <ImageIcon size={16} /> Optional Figure (Image)
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100 cursor-pointer"
                                                        onChange={(e) => handleQuestionImageUpload(e, qIndex)}
                                                    />
                                                    {q.image && (
                                                        <img src={q.image} alt="Question Figure" className="mt-2 h-20 object-contain rounded border border-slate-200" />
                                                    )}
                                                </div>

                                                {q.type === 'mcq' && (
                                                    <div className="space-y-2 mb-4">
                                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Options</label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {q.options.map((opt, oIndex) => (
                                                                <input
                                                                    key={oIndex}
                                                                    type="text"
                                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                                    placeholder={`Option ${oIndex + 1}`}
                                                                    value={opt}
                                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Correct Answer</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder={q.type === 'mcq' ? "Must match one option exactly" : "Correct word/phrase"}
                                                        value={q.correctAnswer}
                                                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-secondary-500 hover:text-secondary-600 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} /> Add Question
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {modalMode === 'quiz' ? 'Create Quiz' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
