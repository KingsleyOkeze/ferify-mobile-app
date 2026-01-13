import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

/**
 * Centered Axios instance configuration
 */
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request Interceptor
 * - Adds Authorization token to headers if available
 */
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // TODO: Implement your token retrieval logic here
            const token = await AsyncStorage.getItem('userToken');

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving auth token:', error);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * - Handle global error states (401, 500, etc.)
 */
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Show success alert if message is present
        if (response.data && response.data.message) {
            alert(`Success: ${response.data.message}`);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Global Error Handling
        if (error.response) {
            const status = error.response.status;
            const errorMessage = (error.response.data as any)?.error || 'An unexpected error occurred';

            console.error(`Status code: ${status}, Message: ${errorMessage}`);
            alert(`Error (${status}): ${errorMessage}`);

            // Handle 401 Unauthorized - Refresh Token Logic
            if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
                (originalRequest as any)._retry = true;

                try {
                    console.log('Attempting to refresh token...');
                    // TODO: Call your refresh token endpoint
                    // const refreshToken = await AsyncStorage.getItem('refreshToken');
                    // const response = await axios.post(`${BASE_URL}/auth/refresh`, { token: refreshToken });

                    // placeholder for successful refresh
                    const newAccessToken = 'NEW_TOKEN_PLACEHOLDER';
                    // await AsyncStorage.setItem('userToken', newAccessToken);

                    // Update the original request with the new token and retry
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // TODO: Handle logout or redirect to login
                    return Promise.reject(refreshError);
                }
            }

            if (status === 403) {
                console.error('Forbidden: You do not have permission.');
            } else if (status === 404) {
                console.error('Not Found: The resource does not exist.');
            } else if (status === 500) {
                console.error('Server Error: Something went wrong on the backend.');
            }
        } else if (error.request) {
            console.error('Network Error: No response received.');
        } else {
            console.error('Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
