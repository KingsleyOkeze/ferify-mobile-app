import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/services/api';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { useAuth } from './AuthContext';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface Notification {
    id: string;
    type: 'fare_verified' | 'fare_confirmed' | 'points_earned' | 'feature_update' | 'general';
    title: string;
    description: string;
    isRead: boolean;
    createdAt: string;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
    activeInAppNotification: Notification | null;
    clearInAppNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeInAppNotification, setActiveInAppNotification] = useState<Notification | null>(null);

    // Sync System App Icon Badge
    useEffect(() => {
        const syncBadge = async () => {
            try {
                if (isAuthenticated) {
                    await Notifications.setBadgeCountAsync(unreadCount);
                } else {
                    await Notifications.setBadgeCountAsync(0);
                }
            } catch (error) {
                console.error('Error syncing badge count:', error);
            }
        };
        syncBadge();
    }, [unreadCount, isAuthenticated]);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const response = await api.get('/api/notification/user-notification-history/history');
            const data = response.data.notifications || [];
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notification history:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        if (!isAuthenticated || unreadCount === 0) return;
        try {
            await api.patch('/api/notification/user-notification-history/mark-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const clearInAppNotification = () => {
        setActiveInAppNotification(null);
    };

    const playNotificationSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/notification.mp3')
            );
            await sound.playAsync();

            // Unload sound after playing to free memory
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing notification sound:', error);
            // Fail silently if sound file is missing
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchNotifications();

            const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || '';
            const newSocket = io(serverUrl, {
                path: '/api/notification/socket.io', // Proxy path
                transports: ['websocket']
            });

            newSocket.on('connect', () => {
                console.log('Connected to notification socket');
                newSocket.emit('join', user.id);
            });

            newSocket.on('new_notification', (notification: Notification) => {
                console.log('New notification received:', notification);
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                setActiveInAppNotification(notification);
                playNotificationSound(); // Play sound when notification arrives
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        } else {
            setNotifications([]);
            setUnreadCount(0);
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [isAuthenticated, user?.id]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                fetchNotifications,
                markAllAsRead,
                activeInAppNotification,
                clearInAppNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
