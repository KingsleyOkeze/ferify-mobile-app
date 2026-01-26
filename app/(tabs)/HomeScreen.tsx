import VoiceSearchModal from "@/components/VoiceSearchModal";
import ModeOfTransportSelect from "@/components/ModeOfTransportSelect";
import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const sharedFares = [
    {
        id: '1',
        from: 'Oshodi',
        to: 'Ikeja',
        time: '18mins ago',
        contributors: 12,
        priceRange: '₦400 - ₦500',
        image: require("../../assets/images/transportation-icons/busImage.png")
    },
    {
        id: '2',
        from: 'Ikeja',
        to: 'Yaba',
        time: '30mins ago',
        contributors: 8,
        priceRange: '₦600 - ₦800',
        image: require("../../assets/images/transportation-icons/busImage.png")
    },
    {
        id: '3',
        from: 'CMS',
        to: 'Ajah',
        time: '5mins ago',
        contributors: 25,
        priceRange: '₦1000 - ₦1200',
        image: require("../../assets/images/transportation-icons/busImage.png")
    }
];

function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [voiceModalVisible, setVoiceModalVisible] = useState(false);

    const FEATURED_CARDS = [
        {
            id: '1',
            title: 'Just finished a trip?',
            description: 'Share your fare to help other commuters plan better.',
            buttonText: 'Share Fare',
            backgroundColor: '#014C1D',
            image: require("../../assets/images/contributeAndEarnImage.png"),
            onPress: () => router.push('../fare-contribution/FareContributionScreen')
        },
        {
            id: '2',
            title: 'Get Real Estimates',
            description: 'Check what others paid for your route before moving.',
            buttonText: 'Check Fares',
            backgroundColor: '#080808',
            image: require("../../assets/images/estimate.png"),
            onPress: () => { }
        },
        {
            id: '3',
            title: 'Save Time',
            description: 'Quickly find previous routes and their price trends.',
            buttonText: 'Explore',
            backgroundColor: '#009688',
            image: require("../../assets/images/speed.png"),
            onPress: () => { }
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
        // Navigate to RouteSelect modal, passing the selected mode if any
        router.push({
            pathname: "/route/RouteSelectScreen",
            params: selectedMode ? { mode: selectedMode } : {}
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Logo */}
                <Text style={styles.logo}>Ferify</Text>

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

                    <TouchableOpacity onPress={() => setVoiceModalVisible(true)}>
                        <Ionicons name="mic" size={20} color="#000" style={styles.micIcon} />
                    </TouchableOpacity>
                </View>

                {/* Voice Search Modal */}
                <VoiceSearchModal
                    visible={voiceModalVisible}
                    onClose={() => setVoiceModalVisible(false)}
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
                                    {/* <Text style={styles.cardTitle}>{item.title}</Text> */}
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
                    {sharedFares.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.feedCard,
                                // index === 0 && styles.firstFeedCard,
                                { borderBottomWidth: 1, borderBottomColor: '#F2F2F2' }
                            ]}
                        >
                            <View style={styles.feedCardLeft}>
                                <Image source={item.image} style={styles.feedTransportImage} />
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
                                    <Text style={styles.feedMetaText}>{item.contributors} contributors</Text>
                                </View>
                            </View>

                            <View style={styles.feedCardRight}>
                                <Text style={styles.feedPriceText}>{item.priceRange}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Action Button (FAB) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.7}
                onPress={() => router.push('../fare-contribution/FareContributionScreen')}
            >
                <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    logo: {
        fontFamily: "BrittiBold",
        fontSize: 26,
        fontWeight: 700,
        color: "#080808",
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 6,
        color: "#000000"
    },
    micIcon: {
        marginLeft: 6,
        color: "#000000"
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#000",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiBold',
        marginBottom: 10,
        color: "#080808",
        marginTop: 25,
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
    // cardTitle: {
    //     color: "#FBFBFB",
    //     fontSize: 14,
    //     fontWeight: 700,
    //     marginBottom: 6,
    // },
    cardDescription: {
        color: "#FBFBFB",
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 10,
        lineHeight: 18,
    },
    shareButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 58,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignSelf: "flex-start",
        height: 37,
        width: 92,
        justifyContent: 'center',    
        alignItems: 'center'
    },
    shareButtonText: {
        color: "#080808",
        fontWeight: 600,
    },
    cardImage: {
        width: 88.71,
        height: 119.59,
        marginLeft: 10,
        position: 'absolute',
        bottom: -5,
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
    // firstFeedCard: {
    //     borderTopWidth: 1,
    //     borderTopColor: '#F2F2F2',
    // },
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
        color: '#666',
        marginBottom: 10,
    },
    routeDestinationText: {
        fontWeight: '600',
        color: '#080808',
    },
    feedMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    feedMetaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    feedCardRight: {
        alignItems: 'flex-end',
        height: '100%'
    },
    feedPriceText: {
        fontSize: 14,
        fontWeight: 600,
        color: '#080808',
    },
    fab: {
        position: 'absolute',
        bottom: 25, // Adjusted to be slightly above the bottom tab
        right: 20,
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