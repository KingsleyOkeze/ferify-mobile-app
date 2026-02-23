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
                if (!isAuthenticated) {
                    await Notifications.setBadgeCountAsync(0);
                    return;
                }

                // Check permissions first to avoid errors on some platforms
                const { status } = await Notifications.getPermissionsAsync();
                if (status === 'granted') {
                    await Notifications.setBadgeCountAsync(unreadCount);
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

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    };

    const connectSocket = async (existingSocket: Socket | null) => {
        const token = await getToken();
        if (!token) return null;

        const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || '';

        // If socket exists and is connected/connecting, just update token and return
        if (existingSocket) {
            console.log('🔄 Reusing existing socket, updating token...');
            existingSocket.auth = { token };
            existingSocket.io.opts.query = { token };

            if (!existingSocket.connected) {
                existingSocket.connect();
            } else {
                // Already connected, but maybe token changed? Re-join just in case
                existingSocket.emit('join', user?.id);
            }
            return existingSocket;
        }

        console.log('📡 Creating new notification socket...');
        const newSocket = io(serverUrl, {
            path: '/api/notification/socket.io',
            transports: ['websocket'],
            query: { token },
            auth: { token },
            reconnection: true,
            reconnectionAttempts: Infinity, // Keep trying!
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Notification socket connected successfully');
            if (user?.id) newSocket.emit('join', user.id);
        });

        newSocket.on('connect_error', (error: any) => {
            console.warn('⚠️ Notification socket connection error:', error.message);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 Notification socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                newSocket.connect();
            }
        });

        newSocket.on('new_notification', (notification: Notification) => {
            console.log('🔔 New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            setActiveInAppNotification(notification);

            if (user?.notificationSettings?.notificationSound !== false) {
                playNotificationSound();
            }
        });

        return newSocket;
    };

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchNotifications();

            let currentSocket: Socket | null = null;

            const init = async () => {
                currentSocket = await connectSocket(socket);
                if (currentSocket) setSocket(currentSocket);
            };

            init();

            // Handle App State (Background/Foreground)
            const handleAppStateChange = async (nextAppState: AppStateStatus) => {
                if (nextAppState === 'active') {
                    console.log('📱 App resumed, refreshing data and socket...');
                    fetchNotifications();

                    if (currentSocket) {
                        if (!currentSocket.connected) {
                            console.log('🔄 Socket was disconnected, reconnecting...');
                            await connectSocket(currentSocket);
                        } else {
                            console.log('🟢 Socket still connected, verifying session...');
                            currentSocket.emit('join', user.id);
                        }
                    } else {
                        const newSock = await connectSocket(null);
                        if (newSock) setSocket(newSock);
                    }
                }
            };

            const subscription = AppState.addEventListener('change', handleAppStateChange);

            return () => {
                subscription.remove();
                // We don't necessarily want to disconnect the socket on every minor effect run,
                // but we should if the user logs out or IDs change (handled by outer logic)
            };
        } else {
            setNotifications([]);
            setUnreadCount(0);
            if (socket) {
                console.log('🧹 Cleaning up socket on logout...');
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
