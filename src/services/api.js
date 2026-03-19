import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL = envApiUrl
  ? envApiUrl.replace(/\/+$/, '')
  : import.meta.env.DEV
    ? 'http://localhost:5001/api'
    : (() => {
        throw new Error('VITE_API_URL is not defined in production. Set it in Vercel Environment Variables.');
      })();

console.log('Using API_URL:', API_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: redirect to login
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me')
};

// Subject APIs
export const subjectAPI = {
    getAll: () => api.get('/subjects'),
    getOne: (subjectId) => api.get(`/subjects/${subjectId}`),
    create: (data) => api.post('/subjects', data),
    update: (subjectId, data) => api.put(`/subjects/${subjectId}`, data),
    delete: (subjectId) => api.delete(`/subjects/${subjectId}`),
    // Admin ops
    assignTeacher: (teacherId, subjectId) => api.post(`/subjects/${subjectId}/assign`, { teacherId }),
    unassignTeacher: (teacherId, subjectId) => api.post(`/subjects/${subjectId}/unassign`, { teacherId })
};

// Chapter APIs
// Chapter APIs
export const chapterAPI = {
    getBySubject: (subjectId) => api.get(`/chapters/subject/${subjectId}`),
    getOne: (subjectId, chapterId) => api.get(`/chapters/${subjectId}/${chapterId}`),
    create: (data) => api.post('/chapters', data),
    update: (subjectId, chapterId, data) => api.put(`/chapters/${subjectId}/${chapterId}`, data),
    addVideo: (subjectId, chapterId, videoUrl) => api.put(`/chapters/${subjectId}/${chapterId}/video`, { videoUrl }),
    addAttachment: (subjectId, chapterId, attachment) => api.post(`/chapters/${subjectId}/${chapterId}/attachments`, { ...attachment })
};

// Quiz APIs
export const quizAPI = {
    get: (subjectId, chapterId) => api.get(`/quizzes/${subjectId}/${chapterId}`),
    create: (data) => api.post('/quizzes', data),
    submit: (subjectId, chapterId, answers) => api.post(`/quizzes/${subjectId}/${chapterId}/submit`, { answers }),
    getMyAttempts: () => api.get('/quizzes/attempts'),
    getAttemptDetails: (attemptId) => api.get(`/quizzes/attempts/${attemptId}`)
};

// Progress APIs
export const progressAPI = {
    getAll: () => api.get('/progress'),
    getBySubject: (subjectId) => api.get(`/progress/${subjectId}`),
    update: (subjectId, chapterId, data) => api.put(`/progress/${subjectId}/${chapterId}`, data)
};

// Leaderboard APIs
export const leaderboardAPI = {
    get: (limit = 50) => api.get(`/leaderboard?limit=${limit}`),
    getMyRank: () => api.get('/leaderboard/my-rank')
};

// User APIs
export const userAPI = {
    updateProfile: (data) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const config = {};

        if (data instanceof FormData) {
            config.headers = { 'Content-Type': undefined };
        }

        return api.put(`/users/${user.id}`, data, config)
            .then(res => {
                // Update local user data if successful
                if (res.data.success) {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    // Merge existing token with new user data in case backend doesn't return token
                    const updatedUser = { ...currentUser, ...res.data.data };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                return res;
            });
    },
    getAllTeachers: () => api.get('/users/teachers'),
    createTeacher: (data) => api.post('/users/teachers', data),
    deleteUser: (id) => api.delete(`/users/${id}`),
    getAllStudents: () => api.get('/users/students'),
    getUserStats: () => api.get('/users/stats')
};

// Admin APIs
export const adminAPI = {
    getStats: () => api.get('/admin/stats')
};

export default api;
