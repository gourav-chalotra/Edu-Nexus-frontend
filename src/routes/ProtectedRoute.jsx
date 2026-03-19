import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
