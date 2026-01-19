import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import mapImage from '../../assets/images/popular-search-icons/map_icon.png'
import shareLocationHand from '../../assets/images/popular-search-icons/share_location_hand_icon.png'
import alertIcon from '../../assets/images/popular-search-icons/alert_icon.png'
import shineIcon from '../../assets/images/popular-search-icons/shine_icon.png'


const { width } = Dimensions.get('window');

// Mock Data
const recentlyUpdated = [
    {
        id: '1',
        image: require('@/assets/images/transportation-icons/busImage.png'),
        route: 'Oshodi - Iyana Ipaja',
        timeAgo: '18 min ago',
        contributors: 12,
        priceRange: '₦400 - ₦500',
    },
    {
        id: '2',
        image: require('@/assets/images/transportation-icons/okadaImage.png'),
        route: 'Ikeja - Ogba',
        timeAgo: '25 min ago',
        contributors: 8,
        priceRange: '₦200 - ₦300',
    },
    {
        id: '3',
        image: require('@/assets/images/transportation-icons/kekeImage.png'),
        route: 'Yaba - Surulere',
        timeAgo: '10 min ago',
        contributors: 15,
        priceRange: '₦150 - ₦200',
    },
];

const popularRoutesToday = [
    {
        id: '1',
        image: require('@/assets/images/transportation-icons/busImage.png'),
        route: 'Lekki - Ajah',
        priceRange: '₦500 - ₦700',
        time: '3:55pm',
        points: 80,
    },
    {
        id: '2',
        image: require('@/assets/images/transportation-icons/kekeImage.png'),
        route: 'Victoria Island - Ikoyi',
        priceRange: '₦300 - ₦400',
        time: '4:15pm',
        points: 80,
    },
    {
        id: '3',
        image: require('@/assets/images/transportation-icons/okadaImage.png'),
        route: 'Maryland - Ojota',
        priceRange: '₦200 - ₦250',
        time: '4:30pm',
        points: 80,
    },
    {
        id: '4',
        image: require('@/assets/images/transportation-icons/okadaImage.png'),
        route: 'CMS - Obalende',
        priceRange: '₦300 - ₦400',
        time: '4:45pm',
        points: 80,
    },
];

const tipsAndInsights = [
    {
        id: '1',
        title: 'Peak Hour Alert',
        body: 'Expect heavy traffic on 3rd Mainland Bridge',
        image: require('@/assets/images/popular-search-icons/alert_icon.png'),
    },
    {
        id: '2',
        title: 'Fast Route',
        body: 'Take Ikorodu Road for faster commute',
        image: require('@/assets/images/popular-search-icons/alert_icon.png'),
    },
    {
        id: '3',
        title: 'Traffic Update',
        body: 'Gridlock cleared at Berger',
        image: require('@/assets/images/popular-search-icons/alert_icon.png'),
    },
];

function DiscoverScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Discover</Text>
                    <Text style={styles.headerSubtitle}>Explore popular routes and latest updates</Text>
                </View>

                {/* Recently Updated Section */}
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
                                {/* 1. Image View */}
                                <Image source={item.image} style={styles.recentImage} />

                                {/* 2. Middle View (Details) */}
                                <View style={styles.recentDetails}>
                                    <Text style={styles.recentRoute} numberOfLines={1}>{item.route}</Text>

                                    <View style={styles.recentMetaRow}>
                                        <Ionicons name="calendar-outline" size={12} color="#666" style={styles.metaIcon} />
                                        <Text style={styles.recentMetaText}>{item.timeAgo}</Text>
                                    </View>

                                    <View style={styles.recentMetaRow}>
                                        <Ionicons name="people-outline" size={12} color="#666" style={styles.metaIcon} />
                                        <Text style={styles.recentMetaText}>{item.contributors} contributors</Text>
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

                {/* Popular Searches */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular searches near you</Text>
                        <View style={styles.hotBadge}>
                            <Text style={styles.hotBadgeText}>HOT 🔥</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.popularSearchCard}>
                        <Image source={shareLocationHand} style={styles.searchImage} />
                        <View style={styles.searchContent}>
                            <Text style={styles.searchMessage}>Check fare estimates for your next trip</Text>
                        </View>
                        <Image source={mapImage} style={styles.searchMapImage} />
                    </TouchableOpacity>
                </View>

                {/* Popular Route Today */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Popular route today</Text>
                    <View style={styles.verticalList}>
                        {popularRoutesToday.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.popularRouteCard,
                                    index === popularRoutesToday.length - 1 && { borderBottomWidth: 0 }
                                ]}
                            >
                                {/* Left: Image */}
                                <Image source={item.image} style={styles.popularRouteImage} />

                                {/* Middle: Details */}
                                <View style={styles.popularRouteDetails}>
                                    <Text style={styles.popularRouteText}>{item.route}</Text>
                                    <Text style={styles.popularRoutePrice}>{item.priceRange}</Text>
                                    <Text style={styles.popularRouteTime}>{item.time}</Text>
                                </View>

                                {/* Right: Points */}
                                <View style={styles.pointsBadge}>
                                    <Text style={styles.pointsText}>+{item.points} points</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Tips & Insight */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tips & Insight</Text>
                    <View style={styles.verticalList}>
                        {tipsAndInsights.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.tipCard}>
                                <View style={styles.tipIconContainer}>
                                    <Image source={item.image as any} style={styles.tipIcon} />
                                </View>
                                <View style={styles.tipContent}>
                                    <Text style={styles.tipTitle}>{item.title}</Text>
                                    <Text style={styles.tipBody} numberOfLines={2}>{item.body}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Promo / Broken Border Card */}
                <TouchableOpacity style={styles.promoCard}>
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
        // fontFamily: 'Britti Sans Trial',
        color: '#080808',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        // fontFamily: 'Britti Sans Trial',
        color: '#393939',
    },
    section: {
        marginBottom: 24,
        // flexDirection: 'column',
        // justifyContent: 'space-between'
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
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
        alignItems: 'flex-start',
        padding: 12,
        // marginBottom: 12,
        width: '100%',
        height: 127,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 2,
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
        color: '#757575',
    },
    recentPriceContainer: {
        paddingLeft: 8,
    },
    recentPrice: {
        fontSize: 14,
        fontWeight: 600,
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
        fontFamily: 'Britti Sans Trial',
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
        borderColor: '#DADADA'
        // height: 65,
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
        // backgroundColor: 'red',
        // borderTopWidth: 1,
        // borderTopColor: '#DADADA',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        gap: 16,
    },
    popularRouteCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: 113,
        borderRadius: 12,
        padding: 12,
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
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    popularRoutePrice: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },
    popularRouteTime: {
        fontSize: 12,
        color: '#888',
    },
    pointsBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: '700',
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
        // marginHorizontal: 10,
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
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    tipBody: {
        fontSize: 13,
        color: '#666',
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
        height: 106
    },
    promoImageContainer: {
        marginRight: 16,
        height: '100%'
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
        fontSize: 18,
        fontWeight: 400,
        color: '#080808',
        marginBottom: 4,
    },
    promoBody: {
        fontSize: 14,
        fontWeight: 400,
        color: '#080808',
    },
});

export default DiscoverScreen;