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
import { getCachedLocation, fetchAndCacheLocation } from "@/services/locationService";
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
            const location = await getCachedLocation() || await fetchAndCacheLocation();

            const params: any = {};
            if (location) {
                params.lng = location.longitude;
                params.lat = location.latitude;
            }

            const [recentRes, popularRes, insightsRes] = await Promise.all([
                api.get('/api/fare/nearby', { params: { ...params, radius: 20000 } }),
                api.get('/api/fare/popular', { params }),
                api.get('/api/fare/insights', { params })
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
                                        <Image
                                            source={
                                                item.vehicleType === 'bus' ?
                                                    require('../../assets/images/popular-search-icons/busImage.png') :
                                                    item.vehicleType === 'keke' ?
                                                        require('../../assets/images/popular-search-icons/kekeImage.png') :
                                                        require('../../assets/images/popular-search-icons/okadaImage.png')
                                            }
                                            style={styles.icon}
                                        />
                                    </View>

                                    {/* 2. Middle View (Details) */}
                                    <View style={styles.recentDetails}>
                                        <Text style={styles.recentRoute} numberOfLines={1}>{item.from} - {item.to}</Text>

                                        <View style={styles.recentMetaRow}>
                                            <Ionicons name="time" size={14} color="#757575" style={styles.metaIcon} />
                                            <Text style={styles.recentMetaText}>{item.time}</Text>
                                        </View>

                                        <View style={styles.recentMetaRow}>
                                            <Ionicons name="people-outline" size={14} color="#757575" style={styles.metaIcon} />
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
                        <Text style={styles.sectionTitle}>Popular Searches Near You</Text>
                        <View style={styles.hotBadge}>
                            <Text style={styles.hotBadgeText}>HOT 🔥</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.popularSearchCard} onPress={() => router.push('/route/RouteSelectScreen')}>
                        <Image source={shareLocationHand} style={styles.searchImage} />
                        <View style={styles.searchContent}>
                            <Text style={styles.searchMessage}>People are checking this route a lot, you should too.</Text>
                        </View>
                        <Image source={mapImage} style={styles.searchMapImage} />
                    </TouchableOpacity>
                </View>

                {/* Popular Route Today */}
                {popularRoutes.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Popular Routes Today</Text>
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
                                        <Image
                                            source={
                                                item.vehicleType === 'bus' ?
                                                    require('../../assets/images/popular-search-icons/busImage.png') :
                                                    item.vehicleType === 'keke' ?
                                                        require('../../assets/images/popular-search-icons/kekeImage.png') :
                                                        require('../../assets/images/popular-search-icons/okadaImage.png')
                                            }
                                            style={styles.icon}
                                        />
                                    </View>

                                    {/* Middle: Details */}
                                    <View style={styles.popularRouteDetails}>
                                        <View style={styles.popularRowHeader}>
                                            <Text style={styles.popularRouteText} numberOfLines={1}>{item.route}</Text>
                                            {/* Right: Points Moved to Top */}
                                            <View style={styles.pointsBadge}>
                                                <Text style={styles.pointsText}>+{item.points} pts</Text>
                                            </View>
                                        </View>

                                        <View style={styles.popularMetaColumn}>
                                            <Text style={styles.popularPriceText}>{item.priceRange}</Text>
                                            <View style={styles.popularTimeRow}>
                                                <Ionicons name="time-outline" size={14} color="#757575" style={styles.metaIcon} />
                                                <Text style={styles.popularMetaText}>{item.time}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Tips & Insight */}
                {showInsights && insights.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Tips & Insight</Text>
                        <View style={styles.tipListContainer}>
                            {insights.map((item) => (
                                <TouchableOpacity key={item.id} style={styles.tipCard}>
                                    <View style={styles.tipIconContainer}>
                                        <Image
                                            source={require('../../assets/images/popular-search-icons/alert_icon.png')}
                                            style={styles.tipIcon}
                                        />
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
                        <Text style={styles.promoTitle}>Safety First</Text>
                        <Text style={styles.promoBody}>
                            Always sit properly in vehicles, avoid overloading,
                            and keep your valuables secure.
                        </Text>
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        marginBottom: 24
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        // backgroundColor: 'red'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#000000',
        paddingRight: 12,
        paddingLeft: 16,
    },

    horizontalScroll: {
        paddingHorizontal: 16,
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
    // firstCard: {
    //     borderTopWidth: 1,
    //     borderTopColor: '#DADADA',
    // },
    recentImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 3.56,
        alignSelf: 'flex-start',
    },
    recentDetails: {
        flex: 1,
        // backgroundColor: 'green',
        height: '100%'
    },
    recentRoute: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        marginBottom: 16,
    },
    recentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        marginRight: 4,
    },
    recentMetaText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24
    },
    recentPriceContainer: {
        paddingLeft: 8,
    },
    recentPrice: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        minHeight: '100%'
    },
    icon: {
        width: 72,
        height: 72,
        borderRadius: 3.56
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
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 8,
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
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        gap: 16,
        // marginBottom: 30
    },
    popularRouteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    popularRouteImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 3.56,
        alignSelf: 'flex-start',
    },
    popularRouteDetails: {
        flex: 1,
    },
    popularRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    popularRouteText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        flex: 1,
        height: '100%'
    },
    popularMetaColumn: {
        marginTop: 4,
    },
    popularPriceText: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 2,
        lineHeight: 24
    },
    popularTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    popularMetaText: {
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
    tipListContainer: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        gap: 8,
        borderWidth: 0
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 16,
        padding: 12,
        marginLeft: 0,
        minHeight: 91,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    tipIconContainer: {
        // width: 48,
        // height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        // backgroundColor: 'red'
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
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 10,
    },
    tipBody: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 20,
    },

    // Promo Card (Broken Border)
    promoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
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
        color: '#080808',
        marginBottom: 4,
        lineHeight: 24
    },
    promoBody: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 20
    },
});

export default DiscoverScreen;
