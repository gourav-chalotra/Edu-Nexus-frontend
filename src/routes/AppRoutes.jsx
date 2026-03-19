import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Landing from '../pages/public/Landing';
import StudentDashboard from '../pages/student/StudentDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Quiz from '../pages/student/Quiz';
import ProtectedRoute from './ProtectedRoute';

import SubjectDetail from '../pages/student/SubjectDetail';
import LearningView from '../pages/student/LearningView';
import ChapterLearning from '../pages/student/ChapterLearning';
import Leaderboard from '../pages/Leaderboard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/leaderboard"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Leaderboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/teacher"
                element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/subject/:subjectId"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <SubjectDetail />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/learn/:subjectId/:chapterId"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <ChapterLearning />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/quiz/:subjectId/:chapterId"
                element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Quiz />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
