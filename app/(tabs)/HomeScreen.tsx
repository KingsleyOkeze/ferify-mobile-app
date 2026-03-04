import VoiceSearchModal from "@/components/VoiceSearchModal";
import ModeOfTransportSelect from "@/components/ModeOfTransportSelect";
import NotificationPermissionModal from "@/components/NotificationPermissionModal";
import { STORAGE_KEYS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Pressable,
    FlatList,
    Dimensions,
    Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native";
import api from "@/services/api";
import { getCachedLocation, fetchAndCacheLocation } from "@/services/locationService";
import { io } from "socket.io-client";
import busImage from "../../assets/images/transportation-icons/busImage.png";
import kekeImage from "../../assets/images/transportation-icons/kekeImage.png";
import okadaImage from "../../assets/images/transportation-icons/okadaImage.png";
import { isVoiceAvailable } from '@/utils/voiceUtils';
import { syncPushTokenWithBackend, setupNotificationListeners } from "@/services/notificationService";
import { useNotifications } from "@/contexts/NotificationContext";

const getVehicleImage = (type: string) => {
    const mode = type?.toLowerCase();
    if (mode === 'keke') return kekeImage;
    if (mode === 'bike' || mode === 'okada') return okadaImage;
    return busImage;
};

function HomeScreen() {
    const router = useRouter();
    const { unreadCount } = useNotifications();
    const [searchText, setSearchText] = useState("");
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [voiceModalVisible, setVoiceModalVisible] = useState(false);
    const [voiceAvailable, setVoiceAvailable] = useState<boolean>(false);
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);

    // Nearby Fares State
    const [nearbyFares, setNearbyFares] = useState<any[]>([]);
    const [isLocalFeed, setIsLocalFeed] = useState(true);
    const [loadingNearby, setLoadingNearby] = useState(false);

    const loadNearbyFares = useCallback(async () => {
        setLoadingNearby(true);
        try {
            // Try to get location, but don't block if it fails
            const location = await getCachedLocation() || await fetchAndCacheLocation();

            const params: any = {};
            if (location) {
                params.lng = location.longitude;
                params.lat = location.latitude;
                params.radius = 10000; // 10km
            }

            const response = await api.get('/api/fare/nearby', { params });

            if (response.data) {
                const { fares, isLocal } = response.data;
                if (fares && fares.length > 0) {
                    setNearbyFares(fares);
                    setIsLocalFeed(isLocal);
                }
            }
        } catch (error) {
            console.warn("Failed to load nearby fares:", error);
        } finally {
            setLoadingNearby(false);
        }
    }, []);

    // Refresh when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadNearbyFares();
        }, [loadNearbyFares])
    );

    useEffect(() => {
        // Register for push notifications and sync token
        syncPushTokenWithBackend();

        // Setup notification listeners
        const cleanupNotifications = setupNotificationListeners();

        // Check voice availability
        const checkVoice = async () => {
            const available = await isVoiceAvailable();
            setVoiceAvailable(available);
        };
        checkVoice();

        // Check Notification Permission Prompt
        const checkNotificationPrompt = async () => {
            try {
                const hasSeen = await cacheHelper.getRaw(STORAGE_KEYS.HAS_SEEN_NOTIF_PROMPT);
                if (!hasSeen) {
                    // Show after 4 seconds
                    setTimeout(() => {
                        setNotificationModalVisible(true);
                    }, 4000);
                }
            } catch (e) {
                console.log("Error checking notification prompt status", e);
            }
        };
        checkNotificationPrompt();

        // Socket connection for real-time updates
        const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL || '';
        const socket = io(serverUrl, {
            path: '/api/fare/socket.io',
            transports: ['websocket']
        });

        socket.on('nearby_contribution', (newFare: any) => {
            console.log('New nearby fare received via socket:', newFare);
            setNearbyFares(prev => {
                const exists = prev.find(f => f.id === newFare.id);
                if (exists) return prev;
                return [newFare, ...prev].slice(0, 3);
            });
            setIsLocalFeed(true);
        });

        // Silent refresh at intervals while staying on screen
        const interval = setInterval(loadNearbyFares, 60000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
            cleanupNotifications();
        };
    }, [loadNearbyFares]);



    const FEATURED_CARDS = [
        {
            id: '1',
            description: 'Earn points every time you share a fare.',
            buttonText: 'Share Fare',
            backgroundColor: '#212121',
            image: require("../../assets/images/contributeAndEarnImage.png"),
            onPress: () => router.push('../fare-contribution/FareContributionScreen')
        },
        {
            id: '2',
            description: 'Check what others paid for your route before moving.',
            buttonText: 'Check Fares',
            backgroundColor: '#2A7FFF',
            image: require("../../assets/images/contributeAndEarnImage.png"),
            onPress: () => router.push('../route/RouteSelectScreen')
        }
    ];

    // Triple the data to enable infinite scroll logic
    const [carouselData] = useState([...FEATURED_CARDS, ...FEATURED_CARDS, ...FEATURED_CARDS]);
    const flatListRef = React.useRef<FlatList>(null);
    const CARD_WIDTH = 320;
    const CARD_MARGIN = 16;
    const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN;

    const handleCarouselScroll = (event: any) => {
        const x = event.nativeEvent.contentOffset.x;

        // When user scrolls to the end of the last set, jump back to the middle set
        if (x >= ITEM_WIDTH * (FEATURED_CARDS.length * 2)) {
            flatListRef.current?.scrollToOffset({
                offset: x - (ITEM_WIDTH * FEATURED_CARDS.length),
                animated: false
            });
        }
        // When user scrolls before the first set, jump to the middle set
        else if (x <= ITEM_WIDTH * (FEATURED_CARDS.length - 1)) {
            flatListRef.current?.scrollToOffset({
                offset: x + (ITEM_WIDTH * FEATURED_CARDS.length),
                animated: false
            });
        }
    };

    const handleSearchPress = () => {
        // Wrap navigation in requestAnimationFrame to ensure touch feedback renders first
        requestAnimationFrame(() => {
            // Navigate to RouteSelect modal, passing the selected mode if any
            router.push({
                pathname: "/route/RouteSelectScreen",
                params: selectedMode ? { mode: selectedMode } : {}
            });
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header: Logo and Notification Bell */}
                <View style={styles.header}>
                    <Image
                        source={require("../../assets/images/logo/ferify-text-logo-white-text.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => router.push('/notification/NotificationScreen')}
                    >
                        <Ionicons name="notifications" size={24} color="#080808" />
                        {unreadCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />

                    <TouchableOpacity onPress={handleSearchPress} style={{ flex: 1 }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Where do you want to go?"
                            placeholderTextColor="#393939"
                            value={searchText}
                            editable={false} // Disable direct editing to prioritize navigation
                            pointerEvents="none" // Ensure touch passes to TouchableOpacity
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={async () => {
                        // Re-check availability on press if it was false
                        let isAvail = voiceAvailable;
                        if (!isAvail) {
                            isAvail = await isVoiceAvailable();
                            setVoiceAvailable(isAvail);
                        }

                        if (!isAvail) {
                            Alert.alert(
                                "Voice Search Unavailable",
                                "Voice search requires a custom development build. If you are on one, please ensure microphone permissions are granted.",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    { text: "Try Anyway", onPress: () => setVoiceModalVisible(true) }
                                ]
                            );
                        } else {
                            setVoiceModalVisible(true);
                        }
                    }}>
                        <Ionicons name="mic" size={20} color="#080808" style={styles.micIcon} />
                    </TouchableOpacity>
                </View>

                {/* Voice Search Modal */}
                <VoiceSearchModal
                    visible={voiceModalVisible}
                    onClose={() => setVoiceModalVisible(false)}
                />

                <NotificationPermissionModal
                    visible={notificationModalVisible}
                    onClose={() => setNotificationModalVisible(false)}
                />

                {/* Mode Selector */}
                <Text style={styles.sectionTitle}>Transport Mode</Text>
                <ModeOfTransportSelect
                    selectedMode={selectedMode}
                    onSelect={(mode) => setSelectedMode(mode)}
                />

                {/* Scrollable Cards Section */}
                <View style={{ marginTop: 25 }}>
                    <FlatList
                        ref={flatListRef}
                        data={carouselData}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={ITEM_WIDTH}
                        decelerationRate="fast"
                        onMomentumScrollEnd={handleCarouselScroll}
                        initialScrollIndex={FEATURED_CARDS.length}
                        getItemLayout={(_, index) => ({
                            length: ITEM_WIDTH,
                            offset: ITEM_WIDTH * index,
                            index,
                        })}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={[styles.featureCard, { backgroundColor: item.backgroundColor, width: CARD_WIDTH }]}>
                                <View style={styles.cardLeft}>
                                    <Text style={styles.cardDescription}>{item.description}</Text>
                                    <TouchableOpacity style={styles.shareButton} onPress={item.onPress}>
                                        <Text style={styles.shareButtonText}>{item.buttonText}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Image
                                    source={item.image}
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        scrollEventThrottle={16}
                    />
                </View>

                {/* Shared by commuters near you */}
                <Text style={styles.sectionTitle}>Shared by commuters near you</Text>

                <View style={styles.feedContainer}>
                    {nearbyFares.length === 0 ? (
                        <View style={styles.noCommuteDataContainer}>
                            <Image
                                source={require("../../assets/images/no-data-images/no_data_found_image.png")}
                                style={styles.noCommuteDataImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.noCommuteDataTitle}>
                                No Shared Route
                            </Text>
                            <Text style={styles.noCommuteDataDescription}>
                                When people around you start sharing fares, they'll appear here
                            </Text>
                            <TouchableOpacity onPress={() => router.push('../fare-contribution/FareContributionScreen')}>
                                <Text style={styles.shareDataText}>
                                    Share Fare
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        nearbyFares.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.feedCard,
                                    { borderBottomWidth: 1, borderBottomColor: '#F2F2F2' }
                                ]}
                            >
                                <View style={styles.feedCardLeft}>
                                    <View style={styles.feedTransportImage}>
                                        <Image
                                            source={getVehicleImage(item.vehicleType)}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>

                                <View style={styles.feedCardMiddle}>
                                    <Text style={styles.routeEntryText}>
                                        <Text style={styles.routeDestinationText}>{item.from} - {item.to}</Text>
                                    </Text>
                                    <View style={styles.feedMetaRow}>
                                        <Ionicons name="time-outline" size={14} color="#666" />
                                        <Text style={styles.feedMetaText}>{item.time}</Text>
                                    </View>
                                    <View style={styles.feedMetaRow}>
                                        <Ionicons name="people-outline" size={14} color="#666" />
                                        <Text style={styles.feedMetaText}>{item.contributors || 1} contributors</Text>
                                    </View>
                                </View>

                                <View style={styles.feedCardRight}>
                                    <Text style={styles.feedPriceText}>{item.priceRange}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Button (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.7}
                onPress={() => {
                    requestAnimationFrame(() => {
                        router.push('../fare-contribution/FareContributionScreen');
                    });
                }}
            >
                <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 66.58,
        height: 26.07,
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FBFBFB',
        zIndex: 1,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'BrittiBold',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 6,
        height: 52
    },
    searchIcon: {
        marginRight: 10,
        color: "#000000"
    },
    micIcon: {
        marginLeft: 6,
        color: "#000000"
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'BrittiSemibold',
        color: "#000",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiBold',
        marginBottom: 18,
        color: "#080808",
        marginTop: 32,
    },
    featureCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 16,
        height: 127,
        borderWidth: 1,
        borderColor: '#DADADA',
        position: 'relative'
    },
    cardLeft: {
        height: 99,
        width: 187,
        justifyContent: 'space-between',
    },
    cardDescription: {
        color: "#FBFBFB",
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 10,
        lineHeight: 24,
        fontFamily: 'BrittiBold',
    },
    shareButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 58,
        paddingVertical: 6,
        alignSelf: "flex-start",
        height: 37,
        width: 98,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareButtonText: {
        color: "#080808",
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
    },
    cardImage: {
        width: 88.71,
        height: 119.59,
        marginLeft: 10,
        position: 'absolute',
        bottom: -10,
        right: 16

    },
    feedContainer: {
        marginTop: 10,
        marginBottom: 30,
        borderTopWidth: 1,
        borderTopColor: '#F2F2F2',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    feedCard: {
        flexDirection: 'row',
        paddingVertical: 20,
        alignItems: 'center',
    },
    feedCardLeft: {
        marginRight: 12,
        height: '100%'
    },
    feedTransportImage: {
        width: 54,
        height: 54,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    feedCardMiddle: {
        flex: 1,
    },
    routeEntryText: {
        fontSize: 14,
        fontFamily: 'BrittiRegular',
        color: '#666',
        marginBottom: 10,
    },
    routeDestinationText: {
        fontWeight: '600',
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    feedMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    feedMetaText: {
        fontSize: 12,
        fontFamily: 'BrittiRegular',
        color: '#666',
        marginLeft: 4,
    },
    feedCardRight: {
        alignItems: 'flex-end',
        height: '100%'
    },
    feedPriceText: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    noCommuteDataContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noCommuteDataImage: {
        width: 150,
        height: 150,
        marginTop: 56,
        marginBottom: 32
    },
    noCommuteDataTitle: {
        fontFamily: 'BrittiSemibold',
        fontSize: 16,
        fontWeight: 600,
        color: '#080808',
        marginBottom: 32,
        lineHeight: 24
    },
    noCommuteDataDescription: {
        fontFamily: 'BrittiRegular',
        fontSize: 14,
        fontWeight: 400,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: '80%',
        lineHeight: 24
    },
    shareDataText: {
        fontFamily: 'BrittiSemibold',
        fontWeight: '600',
        fontSize: 16,
        color: '#080808',
        lineHeight: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        paddingBottom: 1,
        alignSelf: 'center',
        marginBottom: 56
    },
    fab: {
        position: 'absolute',
        bottom: 10, // Adjusted to be slightly above the bottom tab
        right: 7,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
});


export default HomeScreen;