import axios from 'axios';
import { Platform, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';

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
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export const setRefreshToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
        console.error('Error saving refresh token:', error);
    }
};

export const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const removeRefreshToken = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
    notificationSettings?: {
        communityActivity: boolean;
        tipsAndInsight: boolean;
        notificationSound: boolean;
    };
    createdAt?: string;
}

export const setUserData = async (userData: UserData) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
};

export const getUserData = async (): Promise<UserData | null> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

export const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
        console.error('Error removing user data:', error);
    }
};

export const setLastUserName = async (name: string) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_USER_NAME, name);
    } catch (error) {
        console.error('Error saving last user name:', error);
    }
};

export const getLastUserName = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.LAST_USER_NAME);
    } catch (error) {
        console.error('Error getting last user name:', error);
        return null;
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

        // 1. Handle 401 Unauthorized (Token Refresh)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    await Promise.all([removeToken(), removeRefreshToken()]);
                    DeviceEventEmitter.emit('FORCE_LOGOUT');
                    return Promise.reject(error);
                }

                const response = await axios.post(`${BASE_URL}/api/user/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                await setToken(accessToken);
                if (newRefreshToken) {
                    await setRefreshToken(newRefreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                await Promise.all([removeToken(), removeRefreshToken()]);
                DeviceEventEmitter.emit('FORCE_LOGOUT');

                // Show a toast to inform the user why they were logged out
                DeviceEventEmitter.emit('SHOW_TOAST', { type: 'error', message: 'Session expired. Please log in again.' });

                return Promise.reject(refreshError);
            }
        }

        // 2. Handle Retry Mechanism (Network Errors, Timeouts, 5xx)
        const isNetworkError = !error.response && error.message === 'Network Error';
        const isTimeout = error.code === 'ECONNABORTED' && error.message.includes('timeout');
        const isServerError = error.response?.status && error.response.status >= 500;

        if ((isNetworkError || isTimeout || isServerError) && (!originalRequest._retryCount || originalRequest._retryCount < 3)) {
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            const backoffDelay = originalRequest._retryCount * 1500; // 1.5s, 3s, 4.5s

            console.log(`[RETRY] Request failed. Retrying (${originalRequest._retryCount}/3) in ${backoffDelay}ms... Source: ${isNetworkError ? 'Network' : isTimeout ? 'Timeout' : 'Server'}`);

            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return api(originalRequest);
        }

        // 3. User Feedback (Toasts) - only show on final failure
        // 3. User Feedback (Toasts) - only show on final failure
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            DeviceEventEmitter.emit('SHOW_TOAST', { type: 'error', message: 'Request timed out. Please check your connection.' });
        } else if (error.response?.data?.error) {
            // Backend returned a specific error message
            DeviceEventEmitter.emit('SHOW_TOAST', { type: 'error', message: error.response.data.error });
        } else if (error.response?.status) { // Our hard coded err msg incase server doesn't explicitly define it
            const status = error.response.status;
            let msg = 'An unexpected error occurred.';

            if (status >= 500) msg = 'Server error. Please try again later.';
            // else if (status === 404) msg = 'Requested resource not found.';
            else if (status === 403) msg = 'You do not have permission to do this.';
            else if (status === 401) msg = 'Session expired. Please login again.';
            else if (status === 400) msg = 'Invalid request. Please check your input.';
            else if (status === 402) msg = 'Payment required.';
            else if (status === 429) msg = 'Too many requests. Please slow down.';

            if (status !== 404) {
                DeviceEventEmitter.emit('SHOW_TOAST', { type: 'error', message: `${msg} (${status})` });
            }
        } else if (isNetworkError || error.code === 'ERR_NETWORK') {
            // This usually means the client is offline OR the server is completely unreachable
            DeviceEventEmitter.emit('SHOW_TOAST', { type: 'error', message: 'Network error. Please check your internet connection.' });
        }

        return Promise.reject(error);
    }
);

export default api;
