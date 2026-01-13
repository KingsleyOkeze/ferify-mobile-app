import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

function MyContributionOverviewScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState([
        { id: 1, title: 'Contribution points', emoji: '🏆', value: '0', key: 'points' },
        { id: 2, title: 'People helped', emoji: '👥', value: '0', key: 'peopleHelped' },
        { id: 3, title: 'Routes confirmed', emoji: '✅', value: '0', key: 'routesConfirmed' },
        { id: 4, title: 'Fair updated', emoji: '💰', value: '0', key: 'faresUpdated' },
    ]);

    const loadCachedStats = async () => {
        try {
            const cached = await AsyncStorage.getItem('user_contribution_stats');
            if (cached) {
                const parsed = JSON.parse(cached);
                updateStatsArray(parsed);
            }
        } catch (e) {
            console.error('Error loading cached stats:', e);
        }
    };

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/user/contribution/overview');
            if (response.data && response.data.stats) {
                const freshStats = response.data.stats;
                updateStatsArray(freshStats);
                await AsyncStorage.setItem('user_contribution_stats', JSON.stringify(freshStats));
            }
        } catch (error) {
            console.error('Error fetching contribution stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatsArray = (data: any) => {
        setStats(prev => prev.map(s => ({
            ...s,
            value: data[s.key]?.toLocaleString() || '0'
        })));
    };

    useFocusEffect(
        useCallback(() => {
            loadCachedStats();
            fetchStats();
        }, [])
    );

    const menuItems = [
        {
            id: 'achievement',
            title: 'Achievement',
            description: 'Badges and milestones earned',
            icon: 'ribbon-outline',
            onPress: () => { },
        },
        {
            id: 'contributions',
            title: 'My contributions',
            description: "Route, Fares and updates you've submitted",
            icon: 'list-outline',
            onPress: () => { router.push('./setting/contribution/AllContributionsScreen') },
        },
        {
            id: 'trust',
            title: 'Trust and reputation',
            description: 'Your standing in the community',
            icon: 'shield-checkmark-outline',
            onPress: () => { router.push('./setting/contribution/TrustReputationScreen') },
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My contributions</Text>
                <Text style={styles.headerSubtitle}>See how you're helping the community</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchStats} />
                }
            >
                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat) => (
                        <View key={stat.id} style={styles.statCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardEmoji}>{stat.emoji}</Text>
                                <Text style={styles.cardTitle}>{stat.title}</Text>
                            </View>
                            <Text style={styles.cardValue}>{stat.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Ionicons name={item.icon as any} size={24} color="#333" style={styles.itemIcon} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            {/* Arrow without tail - Chevron Forward matches description best */}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
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
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statCard: {
        width: '48%', // Two cards per row with gap
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        height: 100, // Fixed height for consistency
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardEmoji: {
        fontSize: 18,
        marginRight: 6,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        flex: 1, // Allow text to wrap if needed
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        alignSelf: 'flex-end', // Align number to right end
    },
    menuContainer: {
        // paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstMenuItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
});

export default MyContributionOverviewScreen;
