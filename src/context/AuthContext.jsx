import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token and validate with backend
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authAPI.getMe();
                    setUser(response.data.data);
                } catch (error) {
                    console.error('Auth validation failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { data, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            toast.success('Welcome back!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { data, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateUserProgress = (updates) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    const updateProfile = async (data) => {
        try {
            const response = await userAPI.updateProfile(data);
            const updatedUser = response.data.data;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUserProgress,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
