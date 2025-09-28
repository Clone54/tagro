
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'passwordHash' | 'role' | 'profilePictureUrl' | 'addresses' | 'orders'> & { password: string }) => Promise<void>;
  updateUserProfile: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkLoggedInUser = useCallback(async () => {
        setLoading(true);
        try {
            const loggedInUser = await userService.getLoggedInUser();
            setUser(loggedInUser);
        } catch (error) {
            console.log("No user logged in.");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkLoggedInUser();
    }, [checkLoggedInUser]);

    const login = async (email: string, pass: string) => {
        const loggedInUser = await userService.login(email, pass);
        setUser(loggedInUser);
    };

    const logout = () => {
        userService.logout();
        setUser(null);
    };

    const register = async (userData: Omit<User, 'id' | 'passwordHash' | 'role' | 'profilePictureUrl'| 'addresses' | 'orders'> & { password: string }) => {
        await userService.register(userData);
    };

    const updateUserProfile = async (userData: User) => {
        const updatedUser = await userService.updateUser(userData);
        setUser(updatedUser);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
        updateUserProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
