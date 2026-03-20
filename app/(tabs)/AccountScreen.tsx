import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { STORAGE_KEYS, CACHE_TTL as TTL_CONSTANTS } from '@/constants/storage';
import api from '@/services/api';
import { cacheHelper } from '@/utils/cache';

// Cache settings
const ACHIEVEMENT_CACHE_KEY = STORAGE_KEYS.USER_ACHIEVEMENTS;
const CACHE_TTL = TTL_CONSTANTS.SHORT;

function MainAccountProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [trustLevel, setTrustLevel] = useState<string | null>(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!user) return;

            try {
                // Check cache first
                const data = await cacheHelper.get<{ trustLevel: string }>(`${ACHIEVEMENT_CACHE_KEY}_${user.id}`, CACHE_TTL);
                if (data) {
                    setTrustLevel(data.trustLevel);
                    return;
                }

                // If no cache or expired, fetch from backend
                const response = await api.get('/api/user/account/achievements');
                if (response.data) {
                    setTrustLevel(response.data.trustLevel);
                    // Save to cache
                    await cacheHelper.set(`${ACHIEVEMENT_CACHE_KEY}_${user.id}`, response.data);
                }
            } catch (error) {
                console.error('Failed to fetch trust level:', error);
            }
        };

        fetchAchievements();
    }, [user]);

    const getBadgeText = () => {
        if (!trustLevel || trustLevel === 'Bronze') return "New Member";
        return `${trustLevel} Contributor`;
    };

    const getInitials = (first?: string, last?: string) => {
        if (!first && !last) return "??";
        return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
    };

    const menuItems = [
        {
            id: 'community',
            title: 'Community & Contributions',
            icon: 'people-outline',
            onPress: () => { router.push('/contribution/MyContributionOverviewScreen') },
        },
        {
            id: 'account',
            title: 'Accounts & Personal',
            icon: 'person-outline',
            onPress: () => { router.push('../account/AccountAndPersonalMainScreen') },
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
            onPress: () => { router.push('/setting/SettingMainScreen') },
        },
        {
            id: 'help',
            title: 'Help & Feedback',
            icon: 'help-circle-outline',
            onPress: () => { router.push('/help/HelpAndFeedbackScreen') },
        },
        {
            id: 'about',
            title: 'About Ferify',
            icon: 'information-circle-outline',
            onPress: () => { router.push('../about/AboutMainScreen') },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Close Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getInitials(user?.firstName, user?.lastName)}</Text>
                    </View>

                    <Text style={styles.userName}>{user?.firstName || user?.lastName || 'User'}</Text>
                    <Text style={styles.userHandle}>@{user?.username || 'user'}</Text>
                    <Text style={styles.userBadge}>{getBadgeText()}</Text>

                    <TouchableOpacity
                        style={styles.viewProfileButton}
                        onPress={() => router.push('/account/ProfileLandingScreen')}
                    >
                        <Text style={styles.viewProfileText}>View Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={20} color="#393939" style={styles.menuIcon} />
                                <Text style={styles.menuTitle}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#080808" />
                        </TouchableOpacity>
                    ))}
                </View>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 55.13,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    userName: {
        fontSize: 20,
        fontFamily: 'BrittiSemibold',
        color: '#000000',
        marginBottom: 4,
        lineHeight: 24
    },
    userHandle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 12,
        lineHeight: 24
    },
    userBadge: {
        fontSize: 15,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#646464',
        marginBottom: 20,
        lineHeight: 24
    },
    viewProfileButton: {
        backgroundColor: '#F0F0F0',
        // paddingVertical: 10,
        // paddingHorizontal: 24,
        height: 41,
        width: 115,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewProfileText: {
        fontSize: 14,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    menuContainer: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 18,
        height: 60,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 12,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#000',
    },
});

export default MainAccountProfileScreen;