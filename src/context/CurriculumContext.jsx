import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subjectAPI, chapterAPI, quizAPI } from '../services/api';
import toast from 'react-hot-toast';

const CurriculumContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCurriculum = () => useContext(CurriculumContext);

export const CurriculumProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [curriculum, setCurriculum] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch all subjects and chapters when user changes or auth loading finishes
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setCurriculum({});
            setLoading(false);
            return;
        }

        const fetchCurriculum = async () => {
            setLoading(true);
            try {
                const response = await subjectAPI.getAll();
                const subjects = response.data.data;

                // Fetch chapters for each subject concurrently
                const chaptersResults = await Promise.all(
                    subjects.map(subject =>
                        chapterAPI.getBySubject(subject.id)
                            .then(res => ({ id: subject.id, chapters: res.data.data }))
                            .catch(err => {
                                console.error(`Failed to fetch chapters for subject ${subject.id}`, err);
                                return { id: subject.id, chapters: [] }; // Handle individual failure gracefully
                            })
                    )
                );

                const curriculumData = {};
                subjects.forEach(subject => {
                    const subjectChapters = chaptersResults.find(r => r.id === subject.id)?.chapters || [];
                    curriculumData[subject.id] = {
                        ...subject,
                        chapters: subjectChapters
                    };
                });

                setCurriculum(curriculumData);
            } catch (error) {
                console.error('Failed to fetch curriculum:', error);
                toast.error('Failed to load curriculum data');
                // Set empty curriculum on error to avoid blank state
                setCurriculum({});
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, [user, authLoading]);

    const updateChapterVideo = async (subjectId, chapterId, videoUrl) => {
        try {
            await chapterAPI.addVideo(subjectId, chapterId, videoUrl);

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                const chapters = subject.chapters.map(ch =>
                    ch.id === chapterId
                        ? { ...ch, content: { ...ch.content, videoUrl, type: 'video' } }
                        : ch
                );
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters }
                };
            });
        } catch (error) {
            console.error('Failed to add video:', error);
            throw error;
        }
    };

    const addChapterAttachment = async (subjectId, chapterId, attachment) => {
        try {
            await chapterAPI.addAttachment(subjectId, chapterId, attachment);

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                const chapters = subject.chapters.map(ch => {
                    if (ch.id === chapterId) {
                        const currentAttachments = ch.attachments || [];
                        return { ...ch, attachments: [...currentAttachments, attachment] };
                    }
                    return ch;
                });
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters }
                };
            });
        } catch (error) {
            console.error('Failed to add attachment:', error);
            throw error;
        }
    };

    const updateTeacherNote = async (subjectId, chapterId, note) => {
        try {
            await chapterAPI.update(subjectId, chapterId, { teacherNote: note });

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                const chapters = subject.chapters.map(ch =>
                    ch.id === chapterId
                        ? { ...ch, teacherNote: note }
                        : ch
                );
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters }
                };
            });
        } catch (error) {
            console.error('Failed to update teacher note:', error);
            throw error;
        }
    };

    const addChapter = async (subjectId, chapterData) => {
        try {
            const newChapterData = {
                id: Date.now().toString(),
                subjectId,
                content: { type: 'text', body: '' },
                ...chapterData
            };

            const response = await chapterAPI.create(newChapterData);
            const newChapter = response.data.data;

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters: [...subject.chapters, newChapter] }
                };
            });
        } catch (error) {
            console.error('Failed to create chapter:', error);
            throw error;
        }
    };

    const updateChapterDetails = async (subjectId, chapterId, details) => {
        try {
            await chapterAPI.update(subjectId, chapterId, details);

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                const chapters = subject.chapters.map(ch =>
                    ch.id === chapterId
                        ? { ...ch, ...details }
                        : ch
                );
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters }
                };
            });
        } catch (error) {
            console.error('Failed to update chapter:', error);
            throw error;
        }
    };

    const addQuiz = async (subjectId, chapterId, quizData) => {
        try {
            const quizPayload = {
                subjectId,
                chapterId,
                ...quizData
            };

            await quizAPI.create(quizPayload);

            setCurriculum(prev => {
                if (!prev[subjectId]) return prev;

                const subject = { ...prev[subjectId] };
                const chapters = subject.chapters.map(ch => {
                    if (ch.id === chapterId) {
                        return { ...ch, quiz: quizData };
                    }
                    return ch;
                });
                return {
                    ...prev,
                    [subjectId]: { ...subject, chapters }
                };
            });
        } catch (error) {
            console.error('Failed to create quiz:', error);
            throw error;
        }
    };

    const getSubject = (subjectId) => curriculum[subjectId];

    const refreshCurriculum = async () => {
        try {
            const response = await subjectAPI.getAll();
            const subjects = response.data.data;

            const curriculumData = {};
            for (const subject of subjects) {
                const chaptersResponse = await chapterAPI.getBySubject(subject.id);
                curriculumData[subject.id] = {
                    ...subject,
                    chapters: chaptersResponse.data.data
                };
            }

            setCurriculum(curriculumData);
        } catch (error) {
            console.error('Failed to refresh curriculum:', error);
        }
    };

    return (
        <CurriculumContext.Provider value={{
            curriculum,
            loading,
            updateChapterVideo,
            addChapterAttachment,
            updateTeacherNote,
            addChapter,
            updateChapterDetails,
            addQuiz,
            getSubject,
            refreshCurriculum
        }}>
            {children}
        </CurriculumContext.Provider>
    );
};
