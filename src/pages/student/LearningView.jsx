import { useParams, Link } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { ArrowLeft, CheckCircle, PlayCircle, Download, FileText } from 'lucide-react';

const LearningView = () => {
    const { subjectId, chapterId } = useParams();
    // const navigate = useNavigate();
    const { curriculum } = useCurriculum();

    const subject = curriculum[subjectId];
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    if (!chapter) {
        return (
            <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] flex items-center justify-center p-8">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 cartoon-border pop-shadow text-center">
                    <p className="font-display font-bold text-slate-900 dark:text-white text-xl">Chapter not found</p>
                    <Link to={`/subject/${subjectId}`} className="mt-4 px-6 py-2 bg-[#6366f1] text-white rounded-full font-bold shadow-[0_4px_0_0_#4f46e5] active:shadow-none active:translate-y-1 transition-all inline-block">Go Back</Link>
                </div>
            </div>
        );
    }

    const hasVideo = chapter.content?.videoUrl && chapter.content.videoUrl !== '';
    const attachments = chapter.attachments || [];

    const getEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-100 font-body antialiased transition-colors duration-300 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0a0a0c]/80 border-b-[3px] border-slate-100 dark:border-slate-800 px-4 py-3 xl:px-8 transition-colors duration-300 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/subject/${subjectId}`}
                        className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-white dark:bg-slate-800 border-[3px] border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-display font-bold text-slate-900 dark:text-white text-base md:text-lg">{chapter.title}</h1>
                        <p className="text-xs font-bold text-[#6366f1] dark:text-[#818cf8] uppercase tracking-wider">{subject.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to={`/quiz/${subjectId}/${chapterId}`}
                        className="hidden sm:flex items-center justify-center gap-2 px-6 h-10 lg:h-12 rounded-xl border-[3px] border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 font-bold text-slate-700 dark:text-slate-100 shadow-[0_4px_0_0_#e2e8f0] dark:shadow-[0_4px_0_0_#475569] active:shadow-none active:translate-y-1 transition-all text-sm"
                    >
                        <PlayCircle size={18} className="text-[#f97316]" />
                        Take Quiz
                    </Link>
                    <button className="flex items-center justify-center gap-2 px-6 h-10 lg:h-12 rounded-xl bg-[#10b981] hover:bg-[#059669] font-bold text-white shadow-[0_4px_0_0_#059669] active:shadow-none active:translate-y-1 transition-all text-sm">
                        <CheckCircle size={18} />
                        <span className="hidden sm:inline">Mark Complete</span>
                        <span className="sm:hidden">Done</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video bg-slate-900 rounded-[2rem] border-[4px] border-slate-900 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group pop-shadow cartoon-border">
                        {hasVideo ? (
                            <iframe
                                src={getEmbedUrl(chapter.content.videoUrl)}
                                title={chapter.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500">
                                <PlayCircle size={64} className="opacity-50 mb-4" />
                                <span className="text-white font-medium">No Video Lesson Available</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20 border-[3px] border-[#14b8a6]/20 dark:border-[#14b8a6]/30 rounded-[2rem] p-6 cartoon-border">
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{chapter.description}</p>
                    </div>

                    {/* Text Content */}
                    <div className="bg-white dark:bg-slate-800/80 rounded-[2rem] border-[4px] border-slate-100 dark:border-slate-700 p-6 sm:p-8 pop-shadow cartoon-border shadow-sm">
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-300">
                            {chapter.content.body.split('\n').map((line, i) => {
                                if (line.trim().startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                                if (line.trim().startsWith('### ')) return <h3 key={i} className="text-xl font-display font-bold mt-6 mb-3 text-[#6366f1] dark:text-[#818cf8]">{line.replace('### ', '')}</h3>;
                                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-[#14b8a6] my-1">{line.replace('- ', '')}</li>;
                                return <p key={i} className="mb-4 leading-relaxed font-medium">{line}</p>;
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Attachments Section */}
                    <div className="bg-[#6366f1]/10 dark:bg-[#6366f1]/20 rounded-[2rem] p-6 border-[3px] border-[#6366f1]/20 dark:border-[#6366f1]/30 cartoon-border">
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white flex items-center justify-center shadow-sm">
                                <Download size={20} />
                            </div>
                            Resources
                        </h3>
                        {attachments.length > 0 ? (
                            <ul className="space-y-3">
                                {attachments.map((file, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={file.url}
                                            className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-2xl border-[3px] border-white dark:border-slate-700 shadow-sm hover:border-[#6366f1] dark:hover:border-[#818cf8] hover:-translate-y-1 transition-all group"
                                        >
                                            <div className="bg-[#6366f1]/10 p-2.5 rounded-xl text-[#6366f1] shrink-0">
                                                <FileText size={22} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#6366f1] truncate">{file.name}</p>
                                                <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase">{file.type || 'PDF'}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-[#6366f1] group-hover:text-white transition-colors shrink-0">
                                                <Download size={14} />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl text-center border-2 border-dashed border-slate-300 dark:border-slate-600">No attachments for this chapter.</p>
                        )}
                    </div>

                    {/* Topics Covered */}
                    <div className="bg-white dark:bg-slate-800/80 rounded-[2rem] p-6 border-[3px] border-slate-100 dark:border-slate-700 cartoon-border shadow-sm">
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">Topics Covered</h3>
                        <ul className="space-y-4">
                            {chapter.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-3 group">
                                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#10b981]/20 text-[#10b981] flex items-center justify-center">
                                        <CheckCircle size={14} className="stroke-[3]" />
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {topic}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Teacher's Note */}
                    <div className="bg-[#3b82f6]/10 dark:bg-[#3b82f6]/20 rounded-[2rem] p-6 border-[3px] border-[#3b82f6]/20 dark:border-[#3b82f6]/30 cartoon-border relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#3b82f6]/20 rounded-full blur-xl pointer-events-none"></div>
                        <h3 className="font-display font-bold text-xl text-[#1e40af] dark:text-[#60a5fa] mb-3 relative z-10">Teacher's Note</h3>
                        <p className="text-base font-medium text-[#1e3a8a] dark:text-[#93c5fd] leading-relaxed relative z-10">
                            "Remember to watch the video carefully before attempting the quiz!"
                        </p>
                        <div className="mt-6 flex items-center gap-3 relative z-10 pl-4 border-l-4 border-[#3b82f6]">
                            <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                                <span className="font-display font-bold text-lg">S</span>
                            </div>
                            <span className="text-sm font-bold text-[#1e40af] dark:text-[#60a5fa]">Mr. Sharma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningView;
