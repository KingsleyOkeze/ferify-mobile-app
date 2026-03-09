import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { cacheHelper } from '@/utils/cache';
import { STORAGE_KEYS, CACHE_TTL } from '@/constants/storage';

const noContributionImage = require('../../assets/images/no-data-images/no_contribution_image.png');

function MyContributionOverviewScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState([
        {
            id: 1,
            title: 'Contribution points',
            image: require('../../assets/images/my-contributions-icons/stats-icons/contribution_point_icon.png'),
            value: '0',
            key: 'points'
        },
        {
            id: 2,
            title: 'People helped',
            image: require('../../assets/images/my-contributions-icons/stats-icons/people_helped_icon.png'),
            value: '0',
            key: 'peopleHelped'
        },
        {
            id: 3,
            title: 'Routes confirmed',
            image: require('../../assets/images/my-contributions-icons/stats-icons/route_confirmed_icon.png'),
            value: '0',
            key: 'routesConfirmed'
        },
        {
            id: 4,
            title: 'Fair updated',
            image: require('../../assets/images/my-contributions-icons/stats-icons/fare_update_icon.png'),
            value: '0',
            key: 'faresUpdated'
        },
    ]);

    const loadCachedStats = async () => {
        try {
            const cached = await cacheHelper.get<any>(STORAGE_KEYS.CONTRIBUTION_STATS, CACHE_TTL.LONG);
            if (cached) {
                updateStatsArray(cached);
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
                await cacheHelper.set(STORAGE_KEYS.CONTRIBUTION_STATS, freshStats);
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

    // Check if user has any contributions (if any value is not '0')
    const hasContributions = stats.some(stat => stat.value !== '0' && stat.value !== '0.0');


    const menuItems = [
        {
            id: 'achievements',
            title: 'Achievements',
            description: 'Badges and milestones earned',
            image: require('../../assets/images/my-contributions-icons/list-icons/achievements_icon.png'),
            onPress: () => { router.push('../achievement/AchievementsScreen') },
        },
        {
            id: 'contributions',
            title: 'My contributions',
            description: "Route, Fares and updates you've submitted",
            image: require('../../assets/images/my-contributions-icons/list-icons/my_contributions_icon.png'),
            onPress: () => { router.push('./AllContributionsScreen') },
        },
        {
            id: 'trust',
            title: 'Trust and reputation',
            description: 'Your standing in the community',
            image: require('../../assets/images/my-contributions-icons/list-icons/trust_and_reputation_icon.png'),
            onPress: () => { router.push('./TrustAndReputationScreen') },
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
                contentContainerStyle={[
                    styles.scrollContent,
                    (!isLoading && !hasContributions) && { flexGrow: 1 }
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchStats} />
                }
            >
                {/* 
                    Conditionally Render Stats Grid or Empty State
                */}
                {hasContributions ? (
                    <View style={styles.statsGrid}>
                        {stats.map((stat) => (
                            <View key={stat.id} style={styles.statCard}>
                                <View style={styles.cardHeader}>
                                    <Image style={styles.cardImage} source={stat.image} />
                                    <Text style={styles.cardTitle}>{stat.title}</Text>
                                </View>
                                <Text style={styles.cardValue}>{stat.value}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Image source={noContributionImage} style={styles.noDataImage} resizeMode="contain" />
                        <Text style={styles.noDataTitle}>No contribution yet</Text>
                        <Text style={styles.noDataText}>
                            When you submit fares or reports, they will appear here.
                        </Text>
                    </View>
                )}

                {/* Menu List */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                // index === 0 && styles.firstMenuItem
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.itemLeft}>
                                <Image
                                    source={item.image}
                                    style={styles.itemImage}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                            {/* Arrow without tail - Chevron Forward matches description best */}
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
        // paddingTop: 4,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
        color: '#393939',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F3F3',
        height: 94,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        // fontSize: 18,
        width: 20,
        height: 20,
        marginRight: 6,
    },
    cardTitle: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
        color: '#080808',
        flex: 1, // Allow text to wrap if needed
    },
    cardValue: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        alignSelf: 'flex-end', // Align number to right end
    },
    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 60,
    },
    noDataImage: {
        width: 68.67,
        height: 68,
        marginBottom: 16,
    },
    noDataTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginTop: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
        color: '#757575',
        textAlign: 'center',
        lineHeight: 20,
        width: '80%'
    },
    menuContainer: {
        // paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingVertical: 18,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        height: 87
    },
    // firstMenuItem: {
    // },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemImage: {
        width: 36,
        height: 36,
        borderRadius: 50,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
        color: '#000000',
        marginBottom: 8,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
});

export default MyContributionOverviewScreen;
