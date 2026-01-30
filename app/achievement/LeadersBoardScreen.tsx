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
import { useRouter } from 'expo-router';

import api from '@/services/api';
import { ActivityIndicator } from 'react-native';

export default function LeadersBoardScreen() {
    const router = useRouter();
    const [activeToggle, setActiveToggle] = useState<'week' | 'month'>('week');
    const [slideAnim] = useState(new Animated.Value(0));
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    React.useEffect(() => {
        fetchLeaderboard();
    }, [activeToggle]); // Re-fetch if toggle changes (though currently same endpoint)

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            // In a future update, timeframe can be passed as a query param
            const response = await api.get('/api/user/account/leaderboard');

            // Map icons based on rank
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
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

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
                <Text style={styles.title}>Leaderboard</Text>
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
                <Text style={styles.rankingTitle}>Ranking</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
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
                                        <Text style={[styles.rankingName, { fontSize: 12, color: '#666', fontWeight: '400' }]}>{item.title}</Text>
                                    </View>
                                </View>
                                <Text style={styles.rankingCount}>{item.count}</Text>
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
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        marginBottom: 20,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    toggleOuterContainer: {
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 32,
        height: 44
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
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
    },
    activeText: {
        color: '#FFFFFF',
    },
    inactiveText: {
        color: '#757575',
        fontWeight: 400,
        fontSize: 14,
    },
    rankingHeader: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    rankingTitle: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
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
        paddingVertical: 14,
        paddingHorizontal: 16,
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
        marginRight: 12,
    },
    rankingName: {
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    rankingCount: {
        fontSize: 14,
        color: '#1B9E4B',
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
    },
});
