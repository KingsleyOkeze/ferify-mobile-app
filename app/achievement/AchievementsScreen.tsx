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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

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

    // Mock data for levels
    const levels = [
        { id: 1, label: 'Level 1', earned: true },
        { id: 2, label: 'Level 2', earned: true },
        { id: 3, label: 'Level 3', earned: false },
        { id: 4, label: 'Level 4', earned: false },
        { id: 5, label: 'Level 5', earned: false },
    ];

    // Mock data for badges
    const badges = [
        { id: 'starter', title: 'fare starter', earned: true },
        { id: 'helper', title: 'route helper', earned: true },
        { id: 'dropper', title: 'fare dropper', earned: false },
    ];

    // Mock data for leadership
    const leadershipItems = [
        { id: 1, title: 'Ikeja Master', description: 'Most contributions in Ikeja', count: '42 fares' },
        { id: 2, title: 'Route Legend', description: 'Verified over 100 routes', count: '12 routes' },
        { id: 3, title: 'Top Reporter', description: 'Consistent daily reports', count: '8 reports' },
    ];

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
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.statCardTitle}>Points</Text>
                        </View>
                        <Text style={styles.statNumber}>1,240</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="people" size={16} color="#000000" />
                            <Text style={styles.statCardTitle}>Helped</Text>
                        </View>
                        <Text style={styles.statNumber}>852</Text>
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
                        {leadershipItems.map((item, index) => (
                            <View key={item.id} style={styles.leadershipItem}>
                                <View style={styles.leadershipLeft}>
                                    <Text style={styles.rankText}>#{index + 1}</Text>
                                    <View>
                                        <Text style={styles.leadershipText}>{item.title}</Text>
                                        <Text style={styles.leadershipDesc}>{item.description}</Text>
                                    </View>
                                </View>
                                <Text style={styles.leadershipCount}>{item.count}</Text>
                            </View>
                        ))}
                    </View>
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
