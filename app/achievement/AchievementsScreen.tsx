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
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';


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

    React.useEffect(() => {
        loadCachedData();
        fetchData();
    }, []);

    const loadCachedData = async () => {
        try {
            const [achStr, lbStr, badgesStr] = await Promise.all([
                AsyncStorage.getItem('cached_achievements'),
                AsyncStorage.getItem('cached_leaderboard'),
                AsyncStorage.getItem('cached_badges')
            ]);

            const CACHE_TTL = 24 * 60 * 60 * 1000;
            const now = Date.now();

            let hasValidCache = false;

            if (achStr) {
                const cached = JSON.parse(achStr);
                const isFresh = cached.timestamp && (now - cached.timestamp < CACHE_TTL);
                if (cached.data) {
                    setAchievementData(cached.data);
                    if (isFresh) hasValidCache = true;
                }
            }

            if (lbStr) {
                const cached = JSON.parse(lbStr);
                if (cached.data) setLeaderboardData(cached.data);
            }

            if (badgesStr) {
                const cached = JSON.parse(badgesStr);
                if (cached.data) setBadges(cached.data.slice(0, 3));
            }

            // Only stop loading if we have "fresh enough" data
            if (hasValidCache) {
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

            const now = Date.now();
            setAchievementData(achResponse.data);
            setLeaderboardData(lbResponse.data.slice(0, 3));
            setBadges(badgesResponse.data.slice(0, 3));

            // Cache with timestamps
            await Promise.all([
                AsyncStorage.setItem('cached_achievements', JSON.stringify({ timestamp: now, data: achResponse.data })),
                AsyncStorage.setItem('cached_leaderboard', JSON.stringify({ timestamp: now, data: lbResponse.data.slice(0, 3) })),
                AsyncStorage.setItem('cached_badges', JSON.stringify({ timestamp: now, data: badgesResponse.data }))
            ]);
        } catch (error) {
            console.error("Error fetching achievement data:", error);
            setError("Sync failed. Using cached data.");
        } finally {
            setLoading(false);
        }
    };

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
                                <Text style={styles.sectionTitle}>Leadership</Text>
                                <TouchableOpacity onPress={() => router.push('./LeadersBoardScreen')}>
                                    <Text style={styles.seeAll}>See all</Text>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    backButton: {
        marginBottom: 20,
        padding: 4,
        marginLeft: -4,
    },
    titleContainer: {
        // No extra styling needed
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#393939',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 400,
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
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginLeft: 6,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 600,
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#080808',
        textDecorationLine: 'underline',
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
    },
    levelList: {
        paddingRight: 20,
        justifyContent: 'space-between', // Try logic for even spacing if items are few, or use gap
        gap: 12, // Added gap evenly
    },
    levelCard: {
        width: 60, // Sligthly wider to accommodate content better
        height: 96,
        alignItems: 'center',
        // marginRight: 16, // Removed in favor of gap
    },
    levelImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        // backgroundColor: '#EEEEEE',
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
        fontWeight: 400,
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
        fontWeight: 400,
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
        paddingVertical: 12,
        paddingHorizontal: 16,
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginRight: 16,
        width: 30, // Fixed width for alignment
    },
    leadershipText: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    leadershipDesc: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#666',
        marginTop: 2,
    },
    leadershipCount: {
        fontSize: 14,
        color: '#1B9E4B',
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
    },
});
