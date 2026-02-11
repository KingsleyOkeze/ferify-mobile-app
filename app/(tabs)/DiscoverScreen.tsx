import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mapImage from '../../assets/images/popular-search-icons/map_icon.png'
import shareLocationHand from '../../assets/images/popular-search-icons/share_location_hand_icon.png'
import alertIcon from '../../assets/images/popular-search-icons/alert_icon.png'
import shineIcon from '../../assets/images/popular-search-icons/shine_icon.png'

const { width } = Dimensions.get('window');

function DiscoverScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [recentlyUpdated, setRecentlyUpdated] = useState<any[]>([]);
    const [popularRoutes, setPopularRoutes] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [showInsights, setShowInsights] = useState(true);

    const fetchDiscoverData = useCallback(async () => {
        try {
            const [recentRes, popularRes, insightsRes] = await Promise.all([
                api.get('/api/fare/nearby'), // Reusing nearby as global recent
                api.get('/api/fare/popular'),
                api.get('/api/fare/insights')
            ]);

            if (recentRes.data) setRecentlyUpdated(recentRes.data.fares || []);
            if (popularRes.data) setPopularRoutes(popularRes.data);
            if (insightsRes.data) setInsights(insightsRes.data);
        } catch (error) {
            console.error("Error fetching discover data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDiscoverData();
    }, [fetchDiscoverData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDiscoverData();
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#014C1D" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Discover</Text>
                    <Text style={styles.headerSubtitle}>Explore popular routes and latest updates</Text>
                </View>

                {/* Recently Updated Section */}
                {recentlyUpdated.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recently updated</Text>
                        </View>
                        <View style={styles.verticalList}>
                            {recentlyUpdated.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.recentCard,
                                        index === recentlyUpdated.length - 1 && { borderBottomWidth: 0 }
                                    ]}
                                >
                                    {/* 1. Icon View */}
                                    <View style={[styles.recentImage, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Ionicons
                                            name={item.vehicleType === 'bus' ? 'bus' : item.vehicleType === 'keke' ? 'bicycle' : 'car'}
                                            size={32}
                                            color="#080808"
                                        />
                                    </View>

                                    {/* 2. Middle View (Details) */}
                                    <View style={styles.recentDetails}>
                                        <Text style={styles.recentRoute} numberOfLines={1}>{item.from} - {item.to}</Text>

                                        <View style={styles.recentMetaRow}>
                                            <Ionicons name="time-outline" size={12} color="#666" style={styles.metaIcon} />
                                            <Text style={styles.recentMetaText}>{item.time}</Text>
                                        </View>

                                        <View style={styles.recentMetaRow}>
                                            <Ionicons name="people-outline" size={12} color="#666" style={styles.metaIcon} />
                                            <Text style={styles.recentMetaText}>{item.contributors || 1} contributors</Text>
                                        </View>
                                    </View>

                                    {/* 3. Price View */}
                                    <View style={styles.recentPriceContainer}>
                                        <Text style={styles.recentPrice}>{item.priceRange}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Popular Searches */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular searches near you</Text>
                        <View style={styles.hotBadge}>
                            <Text style={styles.hotBadgeText}>HOT 🔥</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.popularSearchCard} onPress={() => router.push('/route/RouteSelectScreen')}>
                        <Image source={shareLocationHand} style={styles.searchImage} />
                        <View style={styles.searchContent}>
                            <Text style={styles.searchMessage}>Check fare estimates for your next trip</Text>
                        </View>
                        <Image source={mapImage} style={styles.searchMapImage} />
                    </TouchableOpacity>
                </View>

                {/* Popular Route Today */}
                {popularRoutes.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Popular routes today</Text>
                        <View style={styles.verticalList}>
                            {popularRoutes.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.popularRouteCard,
                                        index === popularRoutes.length - 1 && { borderBottomWidth: 0 }
                                    ]}
                                >
                                    {/* Left: Icon */}
                                    <View style={[styles.popularRouteImage, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Ionicons
                                            name={item.vehicleType === 'bus' ? 'bus' : item.vehicleType === 'keke' ? 'bicycle' : 'car'}
                                            size={32}
                                            color="#080808"
                                        />
                                    </View>

                                    {/* Middle: Details */}
                                    <View style={styles.popularRouteDetails}>
                                        <Text style={styles.popularRouteText}>{item.route}</Text>
                                        <Text style={styles.popularRoutePrice}>{item.priceRange}</Text>
                                        <Text style={styles.popularRouteTime}>{item.time}</Text>
                                    </View>

                                    {/* Right: Points */}
                                    <View style={styles.pointsBadge}>
                                        <Text style={styles.pointsText}>+{item.points} pts</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Tips & Insight */}
                {showInsights && insights.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tips & Insight</Text>
                        <View style={styles.verticalList}>
                            {insights.map((item) => (
                                <TouchableOpacity key={item.id} style={styles.tipCard}>
                                    <View style={styles.tipIconContainer}>
                                        <Ionicons name="sparkles" size={24} color="#014C1D" />
                                    </View>
                                    <View style={styles.tipContent}>
                                        <Text style={styles.tipTitle}>{item.title}</Text>
                                        <Text style={styles.tipBody} numberOfLines={2}>{item.body}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Promo / Broken Border Card */}
                <TouchableOpacity style={styles.promoCard} onPress={() => router.push('/achievement/LeadersBoardScreen')}>
                    <View style={styles.promoImageContainer}>
                        <Image source={shineIcon} style={styles.promoImage} />
                    </View>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>Contribution Leaderboard</Text>
                        <Text style={styles.promoBody}>See top contributors and earn badges!</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000000',
        marginRight: 10,
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    horizontalScroll: {
        paddingHorizontal: 20,
        paddingRight: 10,
    },

    recentCardContainer: {
        backgroundColor: '#FFFFFF',
    },

    recentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    recentImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 3.56,
    },
    recentDetails: {
        flex: 1,
    },
    recentRoute: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 6,
    },
    recentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaIcon: {
        marginRight: 4,
    },
    recentMetaText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    recentPriceContainer: {
        paddingLeft: 8,
    },
    recentPrice: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },

    // Popular Searches Styles
    hotBadge: {
        backgroundColor: '#2A7FFF',
        width: 63,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    hotBadgeText: {
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#FBFBFB',
    },
    popularSearchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#DADADA',
    },
    searchImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    searchContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    searchMessage: {
        fontSize: 14,
        fontWeight: 400,
        color: '#080808',
        fontFamily: 'BrittiRegular',
        lineHeight: 20,
    },
    searchMapImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        opacity: 0.8,
    },

    // Popular Routes Styles
    verticalList: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        gap: 16,
    },
    popularRouteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    popularRouteImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginRight: 12,
    },
    popularRouteDetails: {
        flex: 1,
    },
    popularRouteText: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 4,
    },
    popularRoutePrice: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 2,
    },
    popularRouteTime: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    pointsBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pointsText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        fontWeight: 400,
        color: '#2E7D32',
    },

    // Tips & Insight Styles
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 16,
        padding: 16,
        minHeight: 91,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    tipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    tipIcon: {
        width: 32,
        height: 32,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 4,
    },
    tipBody: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 18,
    },

    // Promo Card (Broken Border)
    promoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#B69A0DCC',
        borderStyle: 'dashed',
        backgroundColor: '#F08D2512',
        marginBottom: 20,
        height: 106,
    },
    promoImageContainer: {
        marginRight: 16,
        height: '100%',
    },
    promoImage: {
        width: 20,
        height: 24,
        resizeMode: 'contain',
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        fontWeight: 400,
        color: '#080808',
        marginBottom: 4,
    },
    promoBody: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
});

export default DiscoverScreen;
