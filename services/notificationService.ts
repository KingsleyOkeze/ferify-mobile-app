import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';
import { router } from 'expo-router';

/**
 * Gets the current notification permission status.
 */
export const getNotificationPermissionStatus = async (): Promise<'granted' | 'denied' | 'undetermined'> => {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        return status;
    } catch (error) {
        console.error('Error getting notification permission status:', error);
        return 'undetermined';
    }
};

// Configure how notifications are handled when the app is open
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const registerForPushNotificationsAsync = async () => {
    let token: string | undefined;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'notification.mp3', // Custom sound for Android
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowDisplayInNotificationCenter: true,
                    allowAnnouncements: true,
                },
            });
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // This is the Expo Push Token
        try {
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: 'e4f4dbf3-bf02-44d2-a560-b5168fc6e2f8' // Actual projectId from app.json
            })).data;
            console.log('Expo Push Token:', token);
        } catch (e: any) {
            console.warn('Could not fetch push token. This is expected on simulators or if push credentials are not set up.');
            // We don't throw or return error here normally, we just return undefined token
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
};

export const syncPushTokenWithBackend = async () => {
    try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
            await api.put('/api/user/update-push-token', { pushToken: token });
            console.log('Push token synced with backend successfully');
        }
    } catch (error) {
        console.error('Error syncing push token:', error);
    }
};

export const setupNotificationListeners = () => {
    // When a notification is received (foreground)
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification Received in foreground:', notification);
    });

    // When a user taps on a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        console.log('Notification Tapped:', data);

        if (data && typeof data.screen === 'string') {
            router.push(data.screen as any);
        }
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
    };
};
