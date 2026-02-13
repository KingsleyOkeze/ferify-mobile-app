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
import AsyncStorage from '@react-native-async-storage/async-storage';

function NotificationSettingScreen() {
    const router = useRouter();

    // State for toggles
    const [communityActivity, setCommunityActivity] = useState(false);
    const [tipsAndInsight, setTipsAndInsight] = useState(true);
    const [loading, setLoading] = useState(true);

    const CACHE_KEY = 'NOTIFICATION_SETTINGS_CACHE';

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            // 1. Try Cache First (Smart Caching)
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                setCommunityActivity(parsed.communityActivity);
                setTipsAndInsight(parsed.tipsAndInsight);
            }

            // 2. Fetch from Backend
            const response = await api.get('/api/user/notification-settings');
            const { settings } = response.data;

            if (settings) {
                setCommunityActivity(settings.communityActivity);
                setTipsAndInsight(settings.tipsAndInsight);
                // Update Cache
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(settings));
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

        try {
            const body = {
                communityActivity: key === 'communityActivity' ? value : communityActivity,
                tipsAndInsight: key === 'tipsAndInsight' ? value : tipsAndInsight,
            };

            await api.patch('/api/user/notification-settings/update', body);

            // Sync Cache
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(body));
        } catch (error) {
            console.error("Error updating notification setting:", error);
            // Rollback on error
            if (key === 'communityActivity') setCommunityActivity(!value);
            if (key === 'tipsAndInsight') setTipsAndInsight(!value);
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
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
            </View>

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
        marginBottom: 20,
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
    }
});

export default NotificationSettingScreen;
