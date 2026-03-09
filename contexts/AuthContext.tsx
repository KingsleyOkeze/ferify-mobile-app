import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getToken, getUserData, setUserData, removeToken, removeRefreshToken, removeUserData, setToken, setRefreshToken, getRefreshToken, setLastUserName } from '@/services/api';
import api from '@/services/api';

export interface UserData {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    fullName?: string;
    phone?: string;
    location?: string;
    profilePhoto?: string | null;
    avatarColor?: string;
    notificationSettings?: {
        communityActivity: boolean;
        tipsAndInsight: boolean;
        notificationSound: boolean;
    };
    createdAt?: string;
}

interface AuthContextType {
    user: UserData | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData: UserData, token: string, refreshToken?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateUser: (data: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStorageData = useCallback(async () => {
        try {
            const token = await getToken();
            const userData = await getUserData();

            if (token && userData) {
                setUser(userData);
            }
        } catch (error) {
            console.error('Failed to load auth data from storage:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStorageData();
    }, [loadStorageData]);

    const login = async (userData: UserData, token: string, refreshToken?: string) => {
        try {
            await Promise.all([
                setToken(token),
                setUserData(userData),
                userData.firstName ? setLastUserName(userData.firstName) : Promise.resolve(),
                refreshToken ? setRefreshToken(refreshToken) : Promise.resolve(),
            ]);
            setUser(userData);
        } catch (error) {
            console.error('Failed to save auth data on login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                await api.post('/api/user/auth/logout', { refreshToken }).catch(e => console.error('Logout notify failed:', e));
            }
        } finally {
            setUser(null);
            await Promise.all([
                removeToken(),
                removeRefreshToken(),
                removeUserData()
            ]);
        }
    };

    // Global listener for forced logouts (e.g., from api.ts when refresh token expires)
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('FORCE_LOGOUT', () => {
            console.log("Global force logout triggered");
            setUser(null);
            Promise.all([
                removeToken(),
                removeRefreshToken(),
                removeUserData()
            ]).catch(e => console.error("Error clearing storage on force logout", e));
        });

        return () => subscription.remove();
    }, []);

    const refreshUser = async () => {
        try {
            const response = await api.get('/api/user/account/profile');
            if (response.data) {
                const updatedUser = response.data;
                const finalUser = {
                    ...updatedUser,
                    fullName: updatedUser.firstName && updatedUser.lastName
                        ? `${updatedUser.firstName} ${updatedUser.lastName}`
                        : (updatedUser.firstName || updatedUser.lastName || 'Set your name')
                };
                setUser(finalUser);
                await setUserData(finalUser);
                if (finalUser.firstName) {
                    await setLastUserName(finalUser.firstName);
                }
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    const updateUser = useCallback((data: Partial<UserData>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...data };
            setUserData(updated); // Sync to storage
            if (updated.firstName) {
                setLastUserName(updated.firstName);
            }
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            logout,
            refreshUser,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
