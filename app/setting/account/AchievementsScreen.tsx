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
        { id: 1, title: 'Ikeja Master', count: '42 fares', icon: 'ribbon-outline' },
        { id: 2, title: 'Route Legend', count: '12 routes', icon: 'map-outline' },
        { id: 3, title: 'Top Reporter', count: '8 reports', icon: 'megaphone-outline' },
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
                    <Text style={styles.subtitle}>Track your progress and contributions.</Text>
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
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.statCardTitle}>Points</Text>
                        </View>
                        <Text style={styles.statNumber}>1,240</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="people" size={14} color="#007AFF" />
                            <Text style={styles.statCardTitle}>Helped</Text>
                        </View>
                        <Text style={styles.statNumber}>852</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statCardHeader}>
                            <Ionicons name="trophy" size={14} color="#FF9500" />
                            <Text style={styles.statCardTitle}>Rank</Text>
                        </View>
                        <Text style={styles.statNumber}>#12</Text>
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
                        <TouchableOpacity onPress={() => router.push('/setting/account/BadgesScreen')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.badgeRow}>
                        {badges.map((badge) => (
                            <View key={badge.id} style={styles.badgeCard}>
                                <View style={[styles.badgeImageContent, !badge.earned && styles.dullBadge]}>
                                    <Ionicons
                                        name={badge.id === 'starter' ? 'flash' : badge.id === 'helper' ? 'navigate' : 'pin'}
                                        size={40}
                                        color={badge.earned ? "#080808" : "#BBB"}
                                    />
                                </View>
                                <Text style={styles.badgeTitle}>{badge.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Leadership Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Leadership</Text>
                        <TouchableOpacity onPress={() => router.push('/setting/account/LeadersBoardScreen')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.leadershipList}>
                        {leadershipItems.map((item) => (
                            <View key={item.id} style={styles.leadershipItem}>
                                <View style={styles.leadershipLeft}>
                                    <View style={styles.leadershipIconContainer}>
                                        <Ionicons name={item.icon as any} size={24} color="#080808" />
                                    </View>
                                    <Text style={styles.leadershipText}>{item.title}</Text>
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    backButton: {
        marginBottom: 16,
        padding: 4,
        marginLeft: -4,
    },
    titleContainer: {
        // No extra styling needed
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
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
        width: '31%',
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 12,
        height: 100,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    statCardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    statCardTitle: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '600',
        marginLeft: 6,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#080808',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#080808',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    levelList: {
        paddingRight: 20,
    },
    levelCard: {
        width: 80,
        alignItems: 'center',
        marginRight: 16,
    },
    levelImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    dullLevel: {
        opacity: 0.4,
    },
    levelLabel: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badgeCard: {
        flex: 0.3,
        alignItems: 'center',
    },
    badgeImageContent: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    dullBadge: {
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
    },
    badgeTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#080808',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    leadershipList: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        paddingVertical: 8,
    },
    leadershipItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    leadershipLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leadershipIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    leadershipText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#080808',
    },
    leadershipCount: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
});
