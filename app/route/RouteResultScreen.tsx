import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RouteFromAndTo from '@/components/RouteFromAndTo';
import busImage from '../../assets/images/transportation-icons/busImage.png';

// Import the no data image
const noDataImage = require('../../assets/images/no-data-images/no_data_found_image.png');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock Data for Route Breakdown (Fallback if data exists but structure is empty)
const mockRouteLegs = [
    { id: '1', from: 'Agege', to: 'Ikeja Along', price: '₦200 - ₦300', reliability: 'High', contributors: 42, type: 'Bus' },
    { id: '2', from: 'Ikeja Along', to: 'Oshodi', price: '₦150 - ₦250', reliability: 'Medium', contributors: 15, type: 'Bus' },
    { id: '3', from: 'Oshodi', to: 'Mile 2', price: '₦400 - ₦600', reliability: 'High', contributors: 89, type: 'Bus' },
    { id: '4', from: 'Mile 2', to: 'Festac', price: '₦200 - ₦300', reliability: 'High', contributors: 30, type: 'Keke' },
];

function RouteResultScreen() {
    const router = useRouter();
    const { from, to, fareData } = useLocalSearchParams();
    const [breakdownVisible, setBreakdownVisible] = useState(false);

    // Parse fareData to check if we have results
    let hasData = false;
    if (fareData && fareData !== 'null' && fareData !== 'undefined') {
        try {
            const parsed = JSON.parse(fareData as string);
            hasData = !!parsed;
        } catch (e) {
            hasData = false;
        }
    }

    // For now, if hasData is true, we still use mock data for display 
    // because full integration isn't the current task, just the empty state.
    // But we flip the logic: If NO data, show empty state. 
    // If YES data (or mock default in dev), show content.
    // NOTE: To test empty state, pass fareData=null navigation.

    // START UPDATE: Use the parsed logic or fallback to mock if you want to force test 
    // For this specific task, if `fareData` is passed as null string, we treat as empty.
    const showEmptyState = !hasData;

    // Use mock legs if we decide to show content (and haven't fully wired real data display yet)
    const routeLegs = mockRouteLegs;

    const toggleBreakdown = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBreakdownVisible(!breakdownVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Route Details</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {showEmptyState ? (
                    /* EMPTY STATE VIEW */
                    <View style={styles.emptyStateContainer}>
                        <Image source={noDataImage} style={styles.noDataImage} resizeMode="contain" />
                        <Text style={styles.noDataTitle}>No fare data yet</Text>
                        <Text style={styles.noDataText}>
                            Be the first to help others by submitting a fare for the route
                        </Text>
                        <TouchableOpacity
                            style={styles.submitFareButton}
                            onPress={() => router.push({
                                pathname: "/fare-contribution/FareContributionScreen",
                                params: { from: from || "", to: to || "" }
                            })}
                        >
                            <Text style={styles.submitFareButtonText}>Submit a Fare</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* NORMAL CONTENT VIEW */
                    <>
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            {/* Live Update Pill */}
                            <View style={styles.liveUpdateContainer}>
                                <View style={styles.liveUpdatePill}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.liveUpdateText}>Live Update</Text>
                                </View>
                            </View>

                            {/* Route From/To */}
                            <RouteFromAndTo from={(from as string) || "Agege"} to={(to as string) || "Festac"} />

                            {/* Summary Card */}
                            <View style={styles.summaryCard}>
                                {/* Top Row: Fare & Transport Icon */}
                                <View style={styles.summaryTopRow}>
                                    <View>
                                        <Text style={styles.summaryLabel}>Estimated Fare</Text>
                                        <Text style={styles.summaryPrice}>₦1,000 - ₦1,800</Text>
                                    </View>
                                    <Image source={busImage} style={styles.transportIconLarge} resizeMode="contain" />
                                </View>

                                {/* Bottom Row: Reliability & Contributors */}
                                <View style={styles.summaryBottomRow}>
                                    <View style={styles.badgeContainer}>
                                        <Ionicons name="shield-checkmark" size={16} color="#757575" style={styles.badgeIcon} />
                                        <Text style={styles.badgeText}>Highly Reliable</Text>
                                    </View>
                                    <View style={styles.badgeContainer}>
                                        <Ionicons name="people" size={16} color="#757575" style={styles.badgeIcon} />
                                        <Text style={styles.badgeText}>24 Contributors</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Show Fare Breakdown Toggle */}
                            <TouchableOpacity style={styles.breakdownToggle} onPress={toggleBreakdown}>
                                <Text style={styles.breakdownToggleText}>Show Fare Breakdown</Text>
                                <Ionicons
                                    name={breakdownVisible ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#080808"
                                />
                            </TouchableOpacity>

                            {/* Expandable Content */}
                            {breakdownVisible && (
                                <View style={styles.breakdownContainer}>
                                    {/* Progress Line (Left) */}
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressLine} />
                                        {routeLegs.map((_, index) => (
                                            <View key={index} style={[styles.progressNode, { top: index * 160 + 20 }]}>
                                                <Text style={styles.progressNodeText}>L{index + 1}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* Breakdown Cards (Right) */}
                                    <View style={styles.cardsContainer}>
                                        {routeLegs.map((leg, index) => (
                                            <View key={leg.id} style={styles.legCardWrapper}>
                                                {/* The Leg Card */}
                                                <View style={styles.legCard}>
                                                    {/* Card Header: Origin - Line - Dest */}
                                                    <View style={styles.legCardHeader}>
                                                        <Text style={styles.legCityText}>{leg.from}</Text>
                                                        <View style={styles.legHeaderLine} />
                                                        <Text style={styles.legCityText}>{leg.to}</Text>
                                                    </View>

                                                    {/* Card Content */}
                                                    <View style={styles.legCardContent}>
                                                        <Image source={busImage} style={styles.legTransportIcon} resizeMode="contain" />

                                                        <View style={styles.legDetails}>
                                                            <Text style={styles.legPrice}>{leg.price}</Text>

                                                            <View style={styles.miniBadge}>
                                                                <Ionicons name="shield-checkmark-outline" size={12} color="#666" />
                                                                <Text style={styles.miniBadgeText}>{leg.reliability}</Text>
                                                            </View>

                                                            <View style={styles.miniBadge}>
                                                                <Ionicons name="people-outline" size={12} color="#666" />
                                                                <Text style={styles.miniBadgeText}>{leg.contributors} contributors</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                {/* Confirm Fare Link */}
                                                <TouchableOpacity
                                                    style={styles.confirmFareButton}
                                                    onPress={() => router.push({
                                                        pathname: "/fare-contribution/FareContributionScreen",
                                                        params: { from: leg.from, to: leg.to }
                                                    })}
                                                >
                                                    <Text style={styles.confirmFareText}>Confirm Fare</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Fixed Bottom Buttons - Only show if has data? Or maybe allow manual verify even if empty? */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.mapButton}>
                                <Text style={styles.mapButtonText}>Go to Map</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.verifyButton}
                                onPress={() => router.push({
                                    pathname: "/fare-contribution/FareContributionScreen",
                                    params: { from: from || "Not specified", to: to || "Not specified" }
                                })}
                            >
                                <Text style={styles.verifyButtonText}>Verify & Earn</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    liveUpdateContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    liveUpdatePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    liveUpdateText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: '#F2F3F4',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        marginBottom: 20,
        minHeight: 154,
        // Shadow
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 2,
        borderWidth: 1,
        borderColor: '#EBEDEF',
        justifyContent: 'space-between',
    },
    summaryTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    summaryPrice: {
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'BrittiBold',
        color: '#080808',
    },
    transportIconLarge: {
        width: 48,
        height: 48,
    },
    summaryBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeIcon: {
        marginRight: 4,
        width: 20,
        height: 20
    },
    badgeText: {
        fontSize: 14,
        color: '#393939',
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
    },
    breakdownToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginLeft: 'auto'
    },
    breakdownToggleText: {
        color: '#080808',
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        fontSize: 14,
        marginRight: 4,
    },
    breakdownContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
    },
    progressContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: 10,
        position: 'relative',
    },
    progressLine: {
        position: 'absolute',
        top: 20,
        bottom: 120, // Stop before end
        width: 2,
        backgroundColor: '#E0E0E0',
        // Note: React Native doesn't support CSS gradients on Views easily without libraries
        // Used a solid color for now, simulating structure.
    },
    progressNode: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
    },
    progressNodeText: {
        fontSize: 10,
        color: '#666',
        fontWeight: 'bold',
    },
    cardsContainer: {
        flex: 1,
    },
    legCardWrapper: {
        marginBottom: 24,
    },
    legCard: {
        backgroundColor: '#FBFBFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EBEDEF',
        padding: 12,
        minHeight: 106,
        marginBottom: 8,
    },
    legCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEDEF',
        marginBottom: 10,
    },
    legCityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#080808',
        fontFamily: 'BrittiSemibold'
    },
    legHeaderLine: {
        height: 1,
        flex: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 8,
    },
    legCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legTransportIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    legDetails: {
        flex: 1,
    },
    legPrice: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 18,
        color: '#080808',
        fontFamily: 'BrittiBold'
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    miniBadgeText: {
        fontSize: 12,
        fontFamily: 'BrittiRegular',
        fontWeight: 400,
        lineHeight: 20,
        color: '#6B6B6B',
        marginLeft: 4,
    },
    confirmFareButton: {
        alignSelf: 'flex-end',
    },
    confirmFareText: {
        color: '#080808',
        fontFamily: 'BrittiSemibold',
        fontSize: 14,
        fontWeight: 600,
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#fff',
        gap: 12,
    },
    mapButton: {
        // flex: 1,
        width: '48%',
        backgroundColor: '#F0F0F0',
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#080808',
        fontSize: 16,
        fontWeight: '600',
    },
    verifyButton: {
        // flex: 1,
        width: '48%',
        backgroundColor: '#080808',
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        paddingBottom: 50, // Moved up a bit
    },
    noDataImage: {
        width: 200,
        height: 200,
        marginBottom: 24,
    },
    noDataTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#080808',
        marginBottom: 12,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    submitFareButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
    },
    submitFareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RouteResultScreen;