import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { ActivityIndicator, RefreshControl } from 'react-native';
import { useCallback } from 'react';
import { cacheHelper } from '@/utils/cache';
import { STORAGE_KEYS, CACHE_TTL } from '@/constants/storage';

export default function LeadersBoardScreen() {
    const router = useRouter();
    const [activeToggle, setActiveToggle] = useState<'week' | 'month'>('week');
    const [slideAnim] = useState(new Animated.Value(0));
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    const [refreshing, setRefreshing] = useState(false);

    // Initial load from cache
    React.useEffect(() => {
        loadCachedLeaderboard();
    }, []);

    // Fetch in background every time screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchLeaderboard();
        }, [activeToggle])
    );

    const loadCachedLeaderboard = async () => {
        try {
            const cachedData = await cacheHelper.get<any[]>(STORAGE_KEYS.LEADERBOARD, CACHE_TTL.LONG);
            if (cachedData) {
                setLeaderboard(cachedData);
                setLoading(false);
            }
        } catch (e) {
            console.error('Error loading cached leaderboard:', e);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/api/user/account/leaderboard');

            const rankIcons: any = {
                1: 'ribbon-outline',
                2: 'star-outline',
                3: 'medal-outline',
                4: 'diamond-outline',
                5: 'shield-outline'
            };

            const mappedData = response.data.map((item: any) => ({
                ...item,
                name: item.username,
                icon: rankIcons[item.rank] || 'people-outline'
            }));

            setLeaderboard(mappedData);

            // Cache data
            await cacheHelper.set(STORAGE_KEYS.LEADERBOARD, mappedData);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchLeaderboard();
    }, [activeToggle]);

    const handleToggle = (choice: 'week' | 'month') => {
        setActiveToggle(choice);
        Animated.spring(slideAnim, {
            toValue: choice === 'week' ? 0 : 1,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    };

    const slideTranslate = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '50%'],
    });

    const currentRankings = leaderboard;


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.title}>Leaderboards</Text>
            </View>

            {/* Toggle Section */}
            <View style={styles.toggleOuterContainer}>
                <View style={styles.toggleContainer}>
                    <Animated.View
                        style={[
                            styles.slider,
                            { left: slideTranslate }
                        ]}
                    />
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => handleToggle('week')}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.toggleText,
                            activeToggle === 'week' ? styles.activeText : styles.inactiveText
                        ]}>
                            This week
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => handleToggle('month')}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.toggleText,
                            activeToggle === 'month' ? styles.activeText : styles.inactiveText
                        ]}>
                            This month
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Ranking List */}
            <View style={styles.rankingHeader}>
                <Text style={styles.rankingTitle}>Rankings</Text>
            </View>

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
                    <View style={styles.listContainer}>
                        {currentRankings.map((item, index) => (
                            <View key={item.id} style={styles.rankingItem}>
                                <View style={styles.rankingLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={item.icon as any} size={24} color="#080808" />
                                    </View>
                                    <View>
                                        <Text style={styles.rankingName}>{item.name}</Text>
                                        <Text style={[styles.rankingName, { fontSize: 14, color: '#757575', fontFamily: 'BrittiRegular', lineHeight: 24 }]}>{item.title}</Text>
                                    </View>
                                </View>
                                <Text style={styles.rankingCount}>+{item.count}</Text>
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
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    backButton: {
        marginBottom: 24,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -4,
    },
    title: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    toggleOuterContainer: {
        paddingHorizontal: 16,
        marginBottom: 32,
        width: 300,
        height: 44,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        borderRadius: 100,
        padding: 4,
        position: 'relative',
        height: 52,
    },
    slider: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        width: '50%',
        backgroundColor: '#080808',
        borderRadius: 100,
    },
    toggleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    toggleText: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'BrittiSemibold',
    },
    activeText: {
        color: '#FFFFFF',
    },
    inactiveText: {
        color: '#757575',
        fontSize: 14,
    },
    rankingHeader: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    rankingTitle: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    listContainer: {
        borderRadius: 16,
        paddingVertical: 8,
    },
    rankingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 68,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#F3F3F3',
    },
    rankingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    rankingName: {
        fontSize: 14,
        marginBottom: 2,
        lineHeight: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    rankingCount: {
        fontSize: 14,
        lineHeight: 24,
        color: '#1B9E4B',
        fontFamily: 'BrittiRegular',
    },
});
