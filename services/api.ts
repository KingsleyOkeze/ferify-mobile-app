import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Token Management Helpers
export const setToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('auth_token');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('auth_token');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export const setRefreshToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('auth_refresh_token', token);
    } catch (error) {
        console.error('Error saving refresh token:', error);
    }
};

export const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem('auth_refresh_token');
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const removeRefreshToken = async () => {
    try {
        await AsyncStorage.removeItem('auth_refresh_token');
    } catch (error) {
        console.error('Error removing refresh token:', error);
    }
};

// User Data Caching Helpers
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
}

export const setUserData = async (userData: UserData) => {
    try {
        await AsyncStorage.setItem('auth_user_data', JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

export const getUserData = async (): Promise<UserData | null> => {
    try {
        const data = await AsyncStorage.getItem('auth_user_data');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

export const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem('auth_user_data');
    } catch (error) {
        console.error('Error removing user data:', error);
    }
};

// Request Interceptor
api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    await logout(false);
                    return Promise.reject(error);
                }

                // Attempt to refresh token
                const response = await axios.post(`${BASE_URL}/api/user/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Save new tokens
                await setToken(accessToken);
                if (newRefreshToken) {
                    await setRefreshToken(newRefreshToken);
                }

                // Update original request header and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // If refresh fails, logout
                console.error('Token refresh failed:', refreshError);
                await logout(false);
                return Promise.reject(refreshError);
            }
        }

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            // This is definitely a timeout
            console.log("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

/**
 * Unified logout function
 * @param notifyBackend Whether to attempt to blacklist the token on the server
 */
export const logout = async (notifyBackend: boolean = true) => {
    try {
        if (notifyBackend) {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                await api.post('/api/user/auth/logout', { refreshToken });
            }
        }
    } catch (error) {
        console.error('Error notifying backend of logout:', error);
    } finally {
        // Always clear local storage regardless of backend success
        await Promise.all([
            removeToken(),
            removeRefreshToken(),
            removeUserData()
        ]);
    }
};

export default api;
