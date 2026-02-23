import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from 'socket.io-client';
import api, { getToken } from '@/services/api';
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
        let isMounted = true;

        if (isAuthenticated && user?.id) {
            fetchNotifications();

            const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || '';
            const initSocket = async () => {
                const token = await getToken();

                // Avoid creating multiple sockets if one exists and is connected
                if (socket?.connected) return;

                // If socket exists but disconnected, just update token and connect
                if (socket) {
                    socket.auth = { token };
                    socket.io.opts.query = { token };
                    socket.connect();
                    return;
                }

                const newSocket = io(serverUrl, {
                    path: '/api/notification/socket.io',
                    transports: ['websocket'],
                    query: {
                        token: token
                    },
                    auth: {
                        token: token
                    },
                    reconnection: true,             // Enable auto-reconnection
                    reconnectionAttempts: 5,        // Limit attempts
                    reconnectionDelay: 1000,        // Wait 1s before retrying
                });

                newSocket.on('connect', () => {
                    console.log('✅ Notification socket connected successfully (transport:', newSocket.io.engine.transport.name, ')');
                    newSocket.emit('join', user.id);
                });

                newSocket.on('connect_error', (error: any) => {
                    console.error('❌ Notification socket connection error:', error.message, error.description || '', error.context || '');
                });

                newSocket.on('new_notification', (notification: Notification) => {
                    console.log('🔔 New notification received:', notification);
                    if (isMounted) {
                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        setActiveInAppNotification(notification);

                        if (user?.notificationSettings?.notificationSound !== false) {
                            playNotificationSound();
                        }
                    }
                });

                if (isMounted) setSocket(newSocket);
            };

            initSocket();

            // Handle App State (Background/Foreground)
            const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
                if (nextAppState === 'active') {
                    console.log('📱 App resumed, checking socket connection...');
                    fetchNotifications(); // Refresh notifications

                    if (socket && !socket.connected) {
                        console.log('🔄 Reconnecting socket with fresh token...');
                        const freshToken = await getToken();
                        socket.auth = { token: freshToken };
                        socket.io.opts.query = { token: freshToken };
                        socket.connect();
                    }
                }
            });

            return () => {
                isMounted = false;
                subscription.remove();
                if (socket) {
                    socket.disconnect();
                }
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
