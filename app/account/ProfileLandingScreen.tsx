import React from 'react';
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
import { cacheHelper } from '@/utils/cache';
import api from '@/services/api';
import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

// Cache settings
const ACHIEVEMENT_CACHE_KEY = STORAGE_KEYS.USER_ACHIEVEMENTS;
const CACHE_TTL = TTL_CONSTANTS.SHORT;

function ProfileLandingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [achievements, setAchievements] = useState<{ points: number } | null>(null);
    const [loadingAchievements, setLoadingAchievements] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!user) return;

            try {
                // Check cache first
                const data = await cacheHelper.get<any>(`${ACHIEVEMENT_CACHE_KEY}_${user.id}`, CACHE_TTL);
                if (data) {
                    setAchievements(data);
                    setLoadingAchievements(false);
                    return;
                }

                // If no cache or expired, fetch from backend
                const response = await api.get('/api/user/account/achievements');
                if (response.data) {
                    setAchievements(response.data);
                    // Save to cache
                    await cacheHelper.set(`${ACHIEVEMENT_CACHE_KEY}_${user.id}`, response.data);
                }
            } catch (error) {
                console.error('Failed to fetch achievements:', error);
            } finally {
                setLoadingAchievements(false);
            }
        };

        fetchAchievements();
    }, [user]);

    const menuItems = [
        {
            id: 'saved_route',
            title: 'Saved route',
            description: 'Manage your frequently used routes',
            image: require('../../assets/images/profile-icons/saved_routes_icon.png'),
            onPress: () => { /* Nothing happens */ },
            disabledStyle: true
        },
        {
            id: 'achievements',
            title: 'Achievements',
            description: 'Badges and milestones earned',
            image: require('../../assets/images/profile-icons/achievements_icon.png'),
            onPress: () => { router.push('/achievement/AchievementsScreen') },
            disabledStyle: false
        }
    ];

    const getInitials = (first?: string, last?: string) => {
        if (!first && !last) return '??';
        return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
    };

    const getMemberYear = (dateStr?: string) => {
        if (!dateStr) return '2024'; // Fallback
        return new Date(dateStr).getFullYear().toString();
    };

    if (!user) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Center View */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        {user.profilePhoto ? (
                            <Image source={{ uri: user.profilePhoto }} style={styles.avatarImage} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: user.avatarColor || '#F0F0F0' }]}>
                                <Text style={styles.avatarInitials}>
                                    {getInitials(user.firstName, user.lastName)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.pointsLabel}>points</Text>
                    {loadingAchievements ? (
                        <ActivityIndicator size="small" color="#080808" style={{ marginVertical: 8 }} />
                    ) : (
                        <Text style={styles.pointsValue}>{achievements?.points || 0}</Text>
                    )}
                    <Text style={styles.username}>@{user.username || 'user'}</Text>

                    <View style={styles.memberSinceContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#666" style={styles.memberIcon} />
                        <Text style={styles.memberSinceText}>member since {getMemberYear(user.createdAt)}</Text>
                    </View>
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                item.disabledStyle && styles.menuItemDisabled
                            ]}
                            onPress={item.onPress}
                            disabled={item.disabledStyle}
                            activeOpacity={item.disabledStyle ? 1 : 0.7}
                        >
                            <View style={styles.itemLeft}>
                                <Image source={item.image} style={styles.itemImage} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
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
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        paddingTop: 10,
        paddingBottom: 3
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatarImage: {
        width: 52,
        height: 52,
        borderRadius: 39.81,
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 39.81,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 30,
        fontFamily: 'BrittiSemibold',
        fontWeight: 'bold',
        color: '#333',
    },
    pointsLabel: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        textTransform: 'lowercase',
    },
    pointsValue: {
        fontSize: 28,
        fontWeight: 700,
        fontFamily: 'BrittiBold',
        color: '#080808',
        marginVertical: 4,
    },
    username: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 8,
    },
    memberSinceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberIcon: {
        marginRight: 6,
    },
    memberSinceText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    menuContainer: {
        marginTop: 33,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemImage: {
        marginRight: 16,
        width: 36,
        height: 36,
        borderRadius: 56.25
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
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
    menuItemDisabled: {
        backgroundColor: '#FCFCFC',
        opacity: 0.7,
        // Light shadow background indicator as requested
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
        zIndex: 1,
    }
});

export default ProfileLandingScreen;
