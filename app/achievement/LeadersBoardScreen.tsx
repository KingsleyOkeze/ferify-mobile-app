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

export default function LeadersBoardScreen() {
    const router = useRouter();
    const [activeToggle, setActiveToggle] = useState<'week' | 'month'>('week');
    const [slideAnim] = useState(new Animated.Value(0));

    const handleToggle = (choice: 'week' | 'month') => {
        setActiveToggle(choice);
        Animated.spring(slideAnim, {
            toValue: choice === 'week' ? 0 : 1,
            useNativeDriver: false, // backgroundColor and layout properties don't support native driver
            tension: 50,
            friction: 7,
        }).start();
    };

    const slideTranslate = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '50%'],
    });

    // Mock data for weekly rankings
    const weeklyRankings = [
        { id: 1, name: 'Ikeja Master', count: '142 fares', icon: 'ribbon-outline' },
        { id: 2, name: 'Lekki Legend', count: '128 fares', icon: 'star-outline' },
        { id: 3, name: 'Mainland King', count: '115 fares', icon: 'medal-outline' },
        { id: 4, name: 'Island Queen', count: '98 fares', icon: 'diamond-outline' },
        { id: 5, name: 'Route Guardian', count: '87 fares', icon: 'shield-outline' },
    ];

    // Mock data for monthly rankings
    const monthlyRankings = [
        { id: 1, name: 'Lagos Titan', count: '542 fares', icon: 'trophy-outline' },
        { id: 2, name: 'Metro Guru', count: '488 fares', icon: 'flash-outline' },
        { id: 3, name: 'City Guide', count: '415 fares', icon: 'navigate-outline' },
        { id: 4, name: 'Map Expert', count: '398 fares', icon: 'map-outline' },
        { id: 5, name: 'Transit Pro', count: '387 fares', icon: 'bus-outline' },
    ];

    const currentRankings = activeToggle === 'week' ? weeklyRankings : monthlyRankings;

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
                <View style={styles.listContainer}>
                    {currentRankings.map((item, index) => (
                        <View key={item.id} style={styles.rankingItem}>
                            <View style={styles.rankingLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={item.icon as any} size={24} color="#080808" />
                                </View>
                                <Text style={styles.rankingName}>{item.name}</Text>
                            </View>
                            <Text style={styles.rankingCount}>{item.count}</Text>
                        </View>
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
