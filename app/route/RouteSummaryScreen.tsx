import React, { useState, useEffect } from 'react';
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
import busImage from '@/assets/images/busImage.png';
import okadaImage from '@/assets/images/okadaImage.png';
import kekeImage from '@/assets/images/kekeImage.png';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock Data for Route Breakdown (Optional/Placeholder for future real integration)
const routeLegs = [
    { id: '1', from: 'Point A', to: 'Point B', price: '₦100 - ₦200', reliability: 'High', contributors: 10, type: 'Bus' },
];

function RouteSummaryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const from = params.from as string || "Unknown";
    const to = params.to as string || "Unknown";
    const mode = params.mode as string || "Bus";
    const [fareData, setFareData] = useState<any>(null);

    const [breakdownVisible, setBreakdownVisible] = useState(false);

    useEffect(() => {
        if (params.fareData) {
            try {
                setFareData(JSON.parse(params.fareData as string));
            } catch (e) {
                console.error("Error parsing fare data:", e);
            }
        }
    }, [params.fareData]);

    const toggleBreakdown = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBreakdownVisible(!breakdownVisible);
    };

    const getModeImage = (modeName: string) => {
        switch (modeName) {
            case 'Okada': return okadaImage;
            case 'Keke': return kekeImage;
            case 'Bus': return busImage;
            default: return busImage;
        }
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Live Update Pill */}
                <View style={styles.liveUpdateContainer}>
                    <View style={styles.liveUpdatePill}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveUpdateText}>Live Update</Text>
                    </View>
                </View>

                {/* Route From/To */}
                <RouteFromAndTo from={from} to={to} />

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    {/* Top Row: Fare & Transport Icon */}
                    <View style={styles.summaryTopRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.summaryLabel}>Estimated Fare ({mode})</Text>
                            <Text style={styles.summaryPrice}>
                                {fareData ? `₦${fareData.minPrice.toLocaleString()} - ₦${fareData.maxPrice.toLocaleString()}` : 'Calculating...'}
                            </Text>
                            {fareData && (
                                <Text style={styles.typicalText}>Typical: ₦${fareData.typicalPrice.toLocaleString()}</Text>
                            )}
                        </View>
                        <Image source={getModeImage(mode)} style={styles.transportIconLarge} resizeMode="contain" />
                    </View>

                    {/* Bottom Row: Reliability & Contributors */}
                    <View style={styles.summaryBottomRow}>
                        <View style={styles.badgeContainer}>
                            <Ionicons
                                name={fareData?.confidence === 'HIGH' ? "shield-checkmark" : "information-circle-outline"}
                                size={16}
                                color="#000"
                                style={styles.badgeIcon}
                            />
                            <Text style={styles.badgeText}>
                                {fareData?.confidence === 'HIGH' ? 'Highly Reliable' : fareData?.confidence === 'MEDIUM' ? 'Reliable' : 'Estimate'}
                            </Text>
                        </View>
                        <View style={styles.badgeContainer}>
                            <Ionicons name="people" size={16} color="#000" style={styles.badgeIcon} />
                            <Text style={styles.badgeText}>{fareData?.dataPoints || 0} Contributors</Text>
                        </View>
                    </View>

                    {fareData?.message && (
                        <Text style={styles.dataMessage}>{fareData.message}</Text>
                    )}
                </View>

                {/* Show Fare Breakdown Toggle */}
                <TouchableOpacity style={styles.breakdownToggle} onPress={toggleBreakdown}>
                    <Text style={styles.breakdownToggleText}>Show Fare Breakdown</Text>
                    <Ionicons
                        name={breakdownVisible ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="green"
                    />
                </TouchableOpacity>

                {/* Expandable Content */}
                {breakdownVisible && (
                    <View style={styles.breakdownContainer}>
                        {/* Progress Line (Left) */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressLine} />
                            {routeLegs.map((_leg: any, index: number) => (
                                <View key={index} style={[styles.progressNode, { top: index * 160 + 20 }]}>
                                    <Text style={styles.progressNodeText}>L{index + 1}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Breakdown Cards (Right) */}
                        <View style={styles.cardsContainer}>
                            {routeLegs.map((leg: any, _index: number) => (
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
                                    <TouchableOpacity style={styles.confirmFareButton}>
                                        <Text style={styles.confirmFareText}>Confirm Fare</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
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
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        marginBottom: 20,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    transportIconLarge: {
        width: 48,
        height: 48,
    },
    summaryBottomRow: {
        flexDirection: 'row',
        gap: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeIcon: {
        marginRight: 4,
    },
    badgeText: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    typicalText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    dataMessage: {
        fontSize: 12,
        color: '#014C1D',
        marginTop: 12,
        fontStyle: 'italic',
        backgroundColor: '#E8F5E9',
        padding: 8,
        borderRadius: 8,
    },
    breakdownToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    breakdownToggleText: {
        color: 'green',
        fontWeight: '600',
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
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 12,
        marginBottom: 8,
    },
    legCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        marginBottom: 10,
    },
    legCityText: {
        fontSize: 14,
        fontWeight: '600',
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    miniBadgeText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    confirmFareButton: {
        alignSelf: 'flex-end',
    },
    confirmFareText: {
        color: 'green',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

export default RouteSummaryScreen;
