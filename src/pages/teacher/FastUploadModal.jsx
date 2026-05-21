import { useState } from 'react';
import { chapterAPI } from '../../services/api';
import { X, Upload, Plus, Trash2, Video } from 'lucide-react';

const FastUploadModal = ({ isOpen, onClose, subjects }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        subjectId: '',
        chapterId: '',
        title: '',
        description: '',
        classLevel: '10',
        videoUrl: '',
        questions: Array(5).fill({
            question: '',
            options: ['', '', '', ''],
            correctAnswer: '0',
            points: 100
        })
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validation
            if (!formData.subjectId || !formData.chapterId || !formData.title) {
                throw new Error("Subject, Chapter ID, and Title are required");
            }
            if (!formData.videoUrl) {
                throw new Error("Video URL is required");
            }

            const payload = {
                ...formData,
                questions: formData.questions.filter(q => q.question.trim() !== '')
            };

            await chapterAPI.fastUpload(payload);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to upload content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 rounded-[2rem] border-[3px] border-slate-700/50 shadow-2xl w-full max-w-5xl my-8 relative">
                <div className="sticky top-0 z-10 p-6 border-b-2 border-slate-800 bg-slate-900/90 flex justify-between items-center rounded-t-[2rem] backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border-2 border-indigo-500/30">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Fast Content Upload</h2>
                            <p className="text-sm font-bold text-slate-400">Add Chapter + Video + MCQs in one go</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-400 font-bold">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                            Content uploaded successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Chapter Details */}
                        <div className="bg-slate-800/40 p-6 rounded-2xl border-2 border-slate-700/50 space-y-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">1</span>
                                Chapter Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Subject</label>
                                    <select 
                                        name="subjectId" 
                                        value={formData.subjectId} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} (Class {s.classLevel})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Chapter Number/ID (e.g., 1)</label>
                                    <input 
                                        type="text" 
                                        name="chapterId" 
                                        value={formData.chapterId} 
                                        onChange={handleChange}
                                        placeholder="1"
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Chapter Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleChange}
                                        placeholder="e.g. Chemical Reactions"
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Class Level</label>
                                    <input 
                                        type="text" 
                                        name="classLevel" 
                                        value={formData.classLevel} 
                                        onChange={handleChange}
                                        placeholder="10"
                                        className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2 flex items-center gap-2">
                                    <Video size={16} /> YouTube Video URL
                                </label>
                                <input 
                                    type="url" 
                                    name="videoUrl" 
                                    value={formData.videoUrl} 
                                    onChange={handleChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* MCQ Section */}
                        <div className="bg-slate-800/40 p-6 rounded-2xl border-2 border-slate-700/50 space-y-6">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">2</span>
                                5 MCQ Questions
                            </h3>

                            {formData.questions.map((q, qIndex) => (
                                <div key={qIndex} className="p-5 bg-slate-900/50 border-2 border-slate-700 rounded-xl space-y-4 relative group">
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-black border border-slate-700">
                                        Q{qIndex + 1}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase mb-2">Question</label>
                                        <textarea 
                                            value={q.question}
                                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-indigo-500 outline-none min-h-[80px]"
                                            placeholder="Enter question text..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-3">
                                                <input 
                                                    type="radio" 
                                                    name={`correctAnswer-${qIndex}`}
                                                    checked={q.correctAnswer === String(oIndex)}
                                                    onChange={() => handleQuestionChange(qIndex, 'correctAnswer', String(oIndex))}
                                                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className={`w-full bg-slate-800 border-2 rounded-xl px-4 py-2 text-white font-bold outline-none transition-colors ${q.correctAnswer === String(oIndex) ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'}`}
                                                    placeholder={`Option ${['A', 'B', 'C', 'D'][oIndex]}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t-2 border-slate-800">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`px-8 py-3 rounded-xl font-black text-white transition-all flex items-center gap-2 ${loading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1'}`}
                            >
                                {loading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload size={20} /> Submit Data</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FastUploadModal;
