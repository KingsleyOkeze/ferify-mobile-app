import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import CustomSwitch from '@/components/CustomSwitch';
import api from '@/services/api';
import { STORAGE_KEYS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';
import { getNotificationPermissionStatus } from '@/services/notificationService';
import * as Linking from 'expo-linking';

function NotificationSettingScreen() {
    const router = useRouter();

    // State for toggles
    const [communityActivity, setCommunityActivity] = useState(false);
    const [tipsAndInsight, setTipsAndInsight] = useState(true);
    const [notificationSound, setNotificationSound] = useState(true);
    const [loading, setLoading] = useState(true);
    const [osPermissionDenied, setOsPermissionDenied] = useState(false);
    const [isCheckingOS, setIsCheckingOS] = useState(true);

    const CACHE_KEY = STORAGE_KEYS.NOTIFICATION_SETTINGS;

    useEffect(() => {
        const init = async () => {
            await checkOSPermissions();
            await loadSettings();
        };
        init();
    }, []);

    const checkOSPermissions = async () => {
        try {
            const status = await getNotificationPermissionStatus();
            setOsPermissionDenied(status === 'denied');
        } catch (e) {
            console.error('Error checking OS notification permissions:', e);
        } finally {
            setIsCheckingOS(false);
        }
    };

    const loadSettings = async () => {
        try {
            // 1. Try Cache First (Smart Caching)
            const cached = await cacheHelper.getRaw(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                setCommunityActivity(parsed.communityActivity);
                setTipsAndInsight(parsed.tipsAndInsight);
                if (parsed.notificationSound !== undefined) setNotificationSound(parsed.notificationSound);
            }

            // 2. Fetch from Backend
            const response = await api.get('/api/user/notification-settings');
            const { settings } = response.data;

            if (settings) {
                setCommunityActivity(settings.communityActivity);
                setTipsAndInsight(settings.tipsAndInsight);
                if (settings.notificationSound !== undefined) setNotificationSound(settings.notificationSound);
                // Update Cache
                await cacheHelper.setRaw(CACHE_KEY, JSON.stringify(settings));
            }
        } catch (error) {
            console.error("Error loading notification settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: string, value: boolean) => {
        // Optimistic UI Update
        if (key === 'communityActivity') setCommunityActivity(value);
        if (key === 'tipsAndInsight') setTipsAndInsight(value);
        if (key === 'notificationSound') setNotificationSound(value);

        try {
            const body = {
                communityActivity: key === 'communityActivity' ? value : communityActivity,
                tipsAndInsight: key === 'tipsAndInsight' ? value : tipsAndInsight,
                notificationSound: key === 'notificationSound' ? value : notificationSound,
            };

            await api.patch('/api/user/notification-settings/update', body);

            // Sync Cache
            await cacheHelper.setRaw(CACHE_KEY, JSON.stringify(body));
        } catch (error) {
            console.error("Error updating notification setting:", error);
            // Rollback on error
            if (key === 'communityActivity') setCommunityActivity(!value);
            if (key === 'tipsAndInsight') setTipsAndInsight(!value);
            if (key === 'notificationSound') setNotificationSound(!value);
        }
    };

    const notificationItems = [
        {
            id: 'communityActivity',
            title: 'Community activity',
            description: 'When others confirm your route',
            value: communityActivity,
            onValueChange: (val: boolean) => updateSetting('communityActivity', val),
        },
        {
            id: 'tipsAndInsight',
            title: 'Tips & insight',
            description: 'Smart suggestions from Ferify',
            value: tipsAndInsight,
            onValueChange: (val: boolean) => updateSetting('tipsAndInsight', val),
        },
        {
            id: 'notificationSound',
            title: 'Notification sound',
            description: 'Receive alert sound for notification',
            value: notificationSound,
            onValueChange: (val: boolean) => updateSetting('notificationSound', val),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
            </View>

            {/* OS Level Warning Banner */}
            {!isCheckingOS && osPermissionDenied && (
                <View style={styles.warningBanner}>
                    <View style={styles.warningIconContainer}>
                        <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                    </View>
                    <View style={styles.warningTextContainer}>
                        <Text style={styles.warningTitle}>Notifications are disabled</Text>
                        <Text style={styles.warningDesc}>Standard notifications are disabled in your phone settings.</Text>
                        <TouchableOpacity onPress={() => Linking.openSettings()}>
                            <Text style={styles.warningLink}>Go to settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator color="#080808" />
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {notificationItems.map((item, index) => (
                            <View key={item.id} style={styles.listItem}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                                <CustomSwitch
                                    value={item.value}
                                    onValueChange={item.onValueChange}
                                    trackColor={{ false: '#E3E3E3', true: '#080808' }}
                                    thumbColor={'#FFFFFF'}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 20,
        // paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87,
        paddingHorizontal: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    switch: {
        height: 40
    },
    warningBanner: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFF1F0',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    warningIconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        color: '#080808',
        marginBottom: 4,
    },
    warningDesc: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        marginBottom: 8,
        lineHeight: 20,
    },
    warningLink: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        color: '#080808',
        textDecorationLine: 'underline',
    }
});

export default NotificationSettingScreen;
