import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { STORAGE_KEYS, CACHE_TTL as TTL_CONSTANTS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';
import { RefreshControl } from 'react-native';
import { useCallback } from 'react';


// Badge Images Mapping
const badgeImages: any = {
    starter: {
        earned: require('@/assets/images/badges/fare-starter-badge-earned.png'),
        notEarned: require('@/assets/images/badges/fare-starter-badge-not-earned.png'),
    },
    helper: {
        earned: require('@/assets/images/badges/route-helper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/route-helper-badge-not-earned.png'),
    },
    dropper: {
        earned: require('@/assets/images/badges/fare-dropper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/fare-dropper-badge-not-earned.png'),
    },
};

export default function AchievementsScreen() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    const [achievementData, setAchievementData] = React.useState<any>(null);
    const [leaderboardData, setLeaderboardData] = React.useState<any[]>([]);

    const [error, setError] = React.useState<string | null>(null);
    const [badges, setBadges] = React.useState<any[]>([]);

    const [refreshing, setRefreshing] = React.useState(false);

    // Initial load from cache
    React.useEffect(() => {
        loadCachedData();
    }, []);

    // Fetch in background every time screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const loadCachedData = async () => {
        try {
            const CACHE_TTL = TTL_CONSTANTS.LONG; // 24 hours

            const [achData, lbData, badgesData] = await Promise.all([
                cacheHelper.get<any>(STORAGE_KEYS.USER_ACHIEVEMENTS, CACHE_TTL),
                cacheHelper.get<any[]>(STORAGE_KEYS.LEADERBOARD, CACHE_TTL),
                cacheHelper.get<any[]>(STORAGE_KEYS.BADGES, CACHE_TTL)
            ]);

            if (achData) setAchievementData(achData);
            if (lbData) setLeaderboardData(lbData);
            if (badgesData) setBadges(badgesData.slice(0, 3));

            // If we have achievement data, we can at least show something
            if (achData) {
                setLoading(false);
            }
        } catch (e) {
            console.error('Error loading cached achievements:', e);
        }
    };

    const fetchData = async () => {
        try {
            const [achResponse, lbResponse, badgesResponse] = await Promise.all([
                api.get('/api/user/account/achievements'),
                api.get('/api/user/account/leaderboard'),
                api.get('/api/user/account/badges')
            ]);

            setAchievementData(achResponse.data);
            setLeaderboardData(lbResponse.data.slice(0, 3));
            setBadges(badgesResponse.data.slice(0, 3));

            // Cache data
            await Promise.all([
                cacheHelper.set(STORAGE_KEYS.USER_ACHIEVEMENTS, achResponse.data),
                cacheHelper.set(STORAGE_KEYS.LEADERBOARD, lbResponse.data.slice(0, 3)),
                cacheHelper.set(STORAGE_KEYS.BADGES, badgesResponse.data)
            ]);
        } catch (error) {
            console.error("Error fetching achievement data:", error);
            setError("Sync failed. Using cached data.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    // Levels logic: Determine which levels are earned based on achievementData.level
    const levels = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        label: `Level ${i + 1}`,
        earned: achievementData ? achievementData.level >= (i + 1) : false
    }));


    return (
        <SafeAreaView style={styles.container}>
            {/* Rigid Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Achievement</Text>
                    <Text style={styles.subtitle}>Earn badges by helping others move smarter.</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#080808']}
                    />
                }
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#080808" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <View style={styles.statCardHeader}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.statCardTitle}>Points</Text>
                                </View>
                                <Text style={styles.statNumber}>{achievementData?.points?.toLocaleString() || 0}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <View style={styles.statCardHeader}>
                                    <Ionicons name="people" size={16} color="#000000" />
                                    <Text style={styles.statCardTitle}>Helped</Text>
                                </View>
                                <Text style={styles.statNumber}>{achievementData?.helped?.toLocaleString() || 0}</Text>
                            </View>
                        </View>


                        {/* Level Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Level</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.levelList}
                            >
                                {levels.map((level) => (
                                    <View key={level.id} style={styles.levelCard}>
                                        <View style={[styles.levelImageContainer, !level.earned && styles.dullLevel]}>
                                            <Ionicons name="trophy" size={32} color={level.earned ? "#080808" : "#999"} />
                                        </View>
                                        <Text style={styles.levelLabel}>{level.label}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Badges Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Badges</Text>
                                <TouchableOpacity onPress={() => router.push('./BadgesScreen')}>
                                    <Text style={styles.seeAll}>See all</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.badgeRow}>
                                {badges.map((badge) => (
                                    <View key={badge.id} style={styles.badgeCard}>
                                        <Image
                                            source={badge.earned ? badgeImages[badge.id].earned : badgeImages[badge.id].notEarned}
                                            style={styles.badgeImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.badgeTitle}>{badge.title}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Leadership Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Leaderboards</Text>
                                <TouchableOpacity onPress={() => router.push('./LeadersBoardScreen')}>
                                    <Text style={styles.seeAll}>See full leaderboard</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.leadershipList}>
                                {leaderboardData.map((item, index) => (
                                    <View key={item.id} style={styles.leadershipItem}>
                                        <View style={styles.leadershipLeft}>
                                            <Text style={styles.rankText}>#{index + 1}</Text>
                                            <View>
                                                <Text style={styles.leadershipText}>{item.username}</Text>
                                                <Text style={styles.leadershipDesc}>{item.title}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.leadershipCount}>{item.count}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </>
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
        paddingHorizontal: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    backButton: {
        marginBottom: 24,
        paddingTop: 8,
        marginLeft: -4,
    },
    titleContainer: {
    },
    title: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#393939',
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'BrittiRegular',
        color: '#666666',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 12,
        height: 94,
        justifyContent: 'space-between',
    },
    statCardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    statCardTitle: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginLeft: 7,
        lineHeight: 24
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        textAlign: 'right',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    seeAll: {
        fontSize: 14,
        color: '#080808',
        textDecorationLine: 'underline',
        fontFamily: 'BrittiRegular',
    },
    levelList: {
        paddingRight: 20,
        justifyContent: 'space-between',
        gap: 12,
    },
    levelCard: {
        width: 60,
        height: 96,
        alignItems: 'center',
    },
    levelImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dullLevel: {
        opacity: 0.4,
    },
    levelLabel: {
        fontSize: 12,
        color: '#393939',
        fontFamily: 'BrittiSemibold',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badgeCard: {
        flex: 0.3,
        alignItems: 'center',
        height: 177,
        backgroundColor: '#F2F3F4',
        justifyContent: 'center',
        borderRadius: 8,
    },
    badgeImage: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    badgeTitle: {
        fontSize: 12,
        fontFamily: 'BrittiRegular',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    leadershipList: {
        borderRadius: 8,
        marginBottom: 10,
        paddingVertical: 8, // Add padding to container
    },
    leadershipItem: {
        backgroundColor: '#F3F3F3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 68,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    leadershipLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rankText: {
        fontSize: 18,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginRight: 16,
        width: 30, // Fixed width for alignment
    },
    leadershipText: {
        fontSize: 14,
        lineHeight: 24,
        marginBottom: 2,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    leadershipDesc: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    leadershipCount: {
        fontSize: 14,
        color: '#1B9E4B',
        fontFamily: 'BrittiRegular',
    },
});
