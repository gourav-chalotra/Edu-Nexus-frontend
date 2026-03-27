import { curriculumData } from '../data/curriculum';

const DB_KEYS = {
    USERS: 'edu_nexus_users',
    SUBJECTS: 'edu_nexus_subjects',
    CHAPTERS: 'edu_nexus_chapters',
    PROGRESS: 'edu_nexus_progress',
    QUIZZES: 'edu_nexus_quizzes',
    VERSION: 'edu_nexus_version'
};

const CURRENT_VERSION = '1.1';

// Initial Seed Data
const seedDatabase = () => {
    // Version Check & Migration
    const storedVersion = localStorage.getItem(DB_KEYS.VERSION);
    if (storedVersion !== CURRENT_VERSION) {
        console.warn('Database version mismatch. Resetting subjects and chapters for curriculum update.');
        localStorage.removeItem(DB_KEYS.SUBJECTS);
        localStorage.removeItem(DB_KEYS.CHAPTERS);
        // Reset teacher assignments as they might reference old subject IDs
        const users = localStorage.getItem(DB_KEYS.USERS) ? JSON.parse(localStorage.getItem(DB_KEYS.USERS)) : [];
        if (users.length > 0) {
            users.forEach(u => {
                if (u.role === 'teacher') u.assignedSubjects = [];
            });
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }
        localStorage.setItem(DB_KEYS.VERSION, CURRENT_VERSION);
    }

    // 1. Seed Users
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        const users = [
            {
                id: 'admin_1',
                name: 'Admin User',
                email: 'admin@edu.nexus',
                password: 'password123',
                role: 'admin'
            },
            {
                id: 'teacher_1',
                name: 'Demo Teacher',
                email: 'teacher@demo.com',
                password: 'password123',
                role: 'teacher',
                assignedSubjects: []
            },
            {
                id: 'student_1',
                name: 'Demo Student',
                email: 'student@demo.com',
                password: 'password123',
                role: 'student',
                xp: 1500,
                level: 2,
                avatar: 'Felix',
                classLevel: '10',
                streak: 5
            }
        ];
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }

    // 2. Seed Subjects & Chapters (Classes 6-12)
    const storedSubjects = localStorage.getItem(DB_KEYS.SUBJECTS);
    if (!storedSubjects) {
        const subjects = [];
        const chapters = [];
        const classes = ['6', '7', '8', '9', '10'];
        const subjectTypes = [
            { id: 'eng', name: 'English', icon: '🇬🇧' },
            { id: 'hin', name: 'Hindi', icon: '🇮🇳' },
            { id: 'math', name: 'Mathematics', icon: '📐' },
            { id: 'sci', name: 'Science', icon: '🔬' },
            { id: 'sst', name: 'Social Science', icon: '🌍' }
        ];

        classes.forEach(classLevel => {
            subjectTypes.forEach(type => {
                const subjectId = `${type.id}_${classLevel}`;
                // Create Subject
                subjects.push({
                    id: subjectId,
                    name: type.name,
                    classLevel: classLevel,
                    thumbnail: type.icon
                });

                // Create Demo Chapter
                chapters.push({
                    id: `ch_${subjectId}_1`,
                    subjectId: subjectId,
                    title: `Introduction to ${type.name} (Class ${classLevel})`,
                    description: `This is the first chapter of **${type.name}** for Class ${classLevel}. \n\nIn this chapter, we will cover the basics and prepare you for the upcoming advanced topics.`,
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
                    attachments: [],
                    topics: ['Basics', 'Fundamentals', 'Overview'],
                    content: {
                        type: 'text',
                        body: '## Welcome to the Course\n\nThis is a placeholder chapter content. Teachers can edit this.'
                    }
                });
            });
        });

        localStorage.setItem(DB_KEYS.SUBJECTS, JSON.stringify(subjects));
        localStorage.setItem(DB_KEYS.CHAPTERS, JSON.stringify(chapters));

        // Auto-assign some subjects to the demo teacher (e.g., Class 10 Maths & Physics)
        const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS));
        const teacher = users.find(u => u.role === 'teacher');
        if (teacher && (!teacher.assignedSubjects || teacher.assignedSubjects.length === 0)) {
            teacher.assignedSubjects = ['math_10', 'phy_10'];
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
        }
    }

    if (!localStorage.getItem(DB_KEYS.PROGRESS)) {
        localStorage.setItem(DB_KEYS.PROGRESS, JSON.stringify([]));
    }

    if (!localStorage.getItem(DB_KEYS.QUIZZES)) {
        localStorage.setItem(DB_KEYS.QUIZZES, JSON.stringify([]));
    }
};

// Helper: Get Data
const getTable = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

// Helper: Save Data
const saveTable = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
    init: seedDatabase,

    users: {
        getAll: () => getTable(DB_KEYS.USERS),
        getById: (id) => getTable(DB_KEYS.USERS).find(u => u.id === id),
        findByEmail: (email) => getTable(DB_KEYS.USERS).find(u => u.email === email),
        create: (user) => {
            const users = getTable(DB_KEYS.USERS);
            if (users.find(u => u.email === user.email)) throw new Error('User already exists');
            const newUser = { ...user, id: 'user_' + Date.now() };
            users.push(newUser);
            saveTable(DB_KEYS.USERS, users);
            return newUser;
        },
        update: (id, updates) => {
            const users = getTable(DB_KEYS.USERS);
            const index = users.findIndex(u => u.id === id);
            if (index === -1) throw new Error('User not found');
            users[index] = { ...users[index], ...updates };
            saveTable(DB_KEYS.USERS, users);
            return users[index];
        },
        delete: (id) => {
            let users = getTable(DB_KEYS.USERS);
            users = users.filter(u => u.id !== id);
            saveTable(DB_KEYS.USERS, users);
        }
    },

    subjects: {
        getAll: () => getTable(DB_KEYS.SUBJECTS),
        getById: (id) => getTable(DB_KEYS.SUBJECTS).find(s => s.id === id),
        assignToTeacher: (teacherId, subjectId) => {
            const users = getTable(DB_KEYS.USERS);
            const teacher = users.find(u => u.id === teacherId);
            if (teacher && teacher.role === 'teacher') {
                if (!teacher.assignedSubjects) teacher.assignedSubjects = [];
                if (!teacher.assignedSubjects.includes(subjectId)) {
                    teacher.assignedSubjects.push(subjectId);
                    saveTable(DB_KEYS.USERS, users);
                }
            }
        },
        unassignFromTeacher: (teacherId, subjectId) => {
            const users = getTable(DB_KEYS.USERS);
            const teacherIndex = users.findIndex(u => u.id === teacherId);
            if (teacherIndex !== -1) {
                const teacher = users[teacherIndex];
                if (teacher.assignedSubjects) {
                    teacher.assignedSubjects = teacher.assignedSubjects.filter(sid => sid !== subjectId);
                    users[teacherIndex] = teacher;
                    saveTable(DB_KEYS.USERS, users);
                }
            }
        }
    },

    chapters: {
        getAll: () => getTable(DB_KEYS.CHAPTERS),
        getBySubject: (subjectId) => getTable(DB_KEYS.CHAPTERS).filter(c => c.subjectId === subjectId),
        getById: (id) => getTable(DB_KEYS.CHAPTERS).find(c => c.id === id),
        create: (chapter) => {
            const chapters = getTable(DB_KEYS.CHAPTERS);
            const newChapter = { ...chapter, id: 'ch_' + Date.now() };
            chapters.push(newChapter);
            saveTable(DB_KEYS.CHAPTERS, chapters);
            return newChapter;
        },
        update: (id, updates) => {
            const chapters = getTable(DB_KEYS.CHAPTERS);
            const index = chapters.findIndex(c => c.id === id);
            if (index !== -1) {
                chapters[index] = { ...chapters[index], ...updates };
                saveTable(DB_KEYS.CHAPTERS, chapters);
                return chapters[index];
            }
        }
    },

    quizzes: {
        getAll: () => getTable(DB_KEYS.QUIZZES),
        getByChapter: (chapterId) => getTable(DB_KEYS.QUIZZES).filter(q => q.chapterId === chapterId),
        create: (quiz) => {
            const quizzes = getTable(DB_KEYS.QUIZZES);
            const newQuiz = { ...quiz, id: 'qz_' + Date.now() };
            quizzes.push(newQuiz);
            saveTable(DB_KEYS.QUIZZES, quizzes);
            return newQuiz;
        }
    },

    progress: {
        getByUser: (userId) => getTable(DB_KEYS.PROGRESS).filter(p => p.userId === userId),
        update: (userId, chapterId, result) => {
            const progress = getTable(DB_KEYS.PROGRESS);
            let entry = progress.find(p => p.userId === userId && p.chapterId === chapterId);

            if (!entry) {
                entry = { userId, chapterId, quizScores: [], completed: false };
                progress.push(entry);
            }

            if (result.score !== undefined) {
                entry.quizScores.push({
                    score: result.score,
                    xp: result.xp,
                    timestamp: new Date().toISOString()
                });
            }

            if (result.completed) {
                entry.completed = true;
            }

            // Update User XP
            const users = getTable(DB_KEYS.USERS);
            const userIdx = users.findIndex(u => u.id === userId);
            if (userIdx !== -1) {
                users[userIdx].xp = (users[userIdx].xp || 0) + (result.xp || 0);
                saveTable(DB_KEYS.USERS, users);
            }

            saveTable(DB_KEYS.PROGRESS, progress);
            return entry;
        }
    }
};
