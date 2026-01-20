import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration
const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
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

// User Data Caching Helpers
export interface UserData {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    profilePhoto?: string;
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
        if (error.response?.status === 401) {
            // Token expired or invalid
            await removeToken();
            // You might want to trigger a navigation to login here using a global event emitter or similar
        }
        return Promise.reject(error);
    }
);

export default api;
