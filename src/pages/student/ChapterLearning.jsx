import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCurriculum } from '../../context/CurriculumContext';
import { ArrowLeft, PlayCircle, FileText, Download, AlertCircle, BookOpen } from 'lucide-react';

const ChapterLearning = () => {
    const { subjectId, chapterId } = useParams();
    const navigate = useNavigate();
    const { curriculum, loading } = useCurriculum();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
            </div>
        );
    }

    const subject = curriculum[subjectId];
    const chapter = subject?.chapters?.find(ch => ch.id === chapterId);

    if (!subject || !chapter) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-center p-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 cartoon-border pop-shadow text-center">
                    <p className="font-display font-bold text-slate-900 dark:text-white text-xl">Chapter not found</p>
                    <button onClick={() => navigate(`/subject/${subjectId}`)} className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-full font-bold shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all">Go Back</button>
                </div>
            </div>
        );
    }

    const content = chapter.content || {};

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased transition-colors duration-300 pb-32">

            {/* Header */}
            <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0a0a0c]/80 border-b-[3px] border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/subject/${subjectId}`)}
                        className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-white dark:bg-slate-800 border-[3px] border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#6366f1] tracking-wider uppercase">{subject.title}</span>
                            <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chapter Learning</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white truncate">
                            {chapter.title}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">

                {/* Introduction / Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {chapter.description}
                    </p>
                </motion.div>

                {/* Primary Content Area (Video or Text) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10 bg-white dark:bg-slate-800 rounded-[2rem] border-[4px] border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
                >
                    {content.type === 'video' && content.videoUrl ? (
                        <div className="aspect-video w-full bg-slate-900 relative">
                            <iframe
                                src={content.videoUrl}
                                title="Chapter Video"
                                className="absolute inset-0 w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                        </div>
                    ) : content.type === 'text' && content.body ? (
                        <div className="p-8 prose dark:prose-invert max-w-none prose-lg">
                            <div dangerouslySetInnerHTML={{ __html: content.body }} />
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-4">
                            <BookOpen size={48} className="text-slate-300 dark:text-slate-600" />
                            <p className="font-medium text-lg">No content has been added to this chapter yet.</p>
                        </div>
                    )}
                </motion.div>

                {/* Topics Tags */}
                {chapter.topics && chapter.topics.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Topics Covered</h3>
                        <div className="flex flex-wrap gap-2">
                            {chapter.topics.map((topic, i) => (
                                <span key={i} className="bg-[#6366f1]/10 text-[#6366f1] dark:text-[#818cf8] font-bold px-4 py-2 rounded-xl text-sm border-2 border-[#6366f1]/20">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Teacher Notes Section */}
                    {chapter.teacherNote && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#fbbf24]/10 border-2 border-[#fbbf24]/30 rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4 text-[#d97706] dark:text-[#fbbf24]">
                                <AlertCircle size={24} className="flex-shrink-0" />
                                <h3 className="font-display font-bold text-lg">Teacher's Note</h3>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {chapter.teacherNote}
                            </p>
                        </motion.div>
                    )}

                    {/* Resources/Attachments Section */}
                    {chapter.attachments && chapter.attachments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4 text-[#6366f1]">
                                <FileText size={24} className="flex-shrink-0" />
                                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">Study Resources</h3>
                            </div>
                            <ul className="space-y-3">
                                {chapter.attachments.map((file, i) => (
                                    <li key={i}>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 hover:border-[#6366f1] transition-colors group"
                                        >
                                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-4">{file.name}</span>
                                            <div className="text-[#6366f1] bg-[#6366f1]/10 p-2 rounded-xl group-hover:bg-[#6366f1] group-hover:text-white transition-colors">
                                                <Download size={18} />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>

                {/* Sticky Bottom Call to Action */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#0a0a0c] dark:via-[#0a0a0c]/90 pointer-events-none z-40">
                    <div className="max-w-4xl mx-auto flex justify-end pointer-events-auto">
                        <Link
                            to={`/quiz/${subjectId}/${chapterId}`}
                            className="flex items-center gap-3 px-8 h-14 rounded-2xl bg-[#f97316] hover:bg-[#ea580c] text-white font-black text-lg shadow-[0_4px_0_0_#c2410c] active:shadow-none active:translate-y-1 transition-all"
                        >
                            <PlayCircle size={24} />
                            <span>Take Chapter Quiz</span>
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ChapterLearning;
