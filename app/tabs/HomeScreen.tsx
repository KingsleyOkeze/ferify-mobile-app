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
    Pressable
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
        image: require("../../assets/images/busImage.png")
    },
    {
        id: '2',
        from: 'Ikeja',
        to: 'Yaba',
        time: '30mins ago',
        contributors: 8,
        priceRange: '₦600 - ₦800',
        image: require("../../assets/images/busImage.png")
    },
    {
        id: '3',
        from: 'CMS',
        to: 'Ajah',
        time: '5mins ago',
        contributors: 25,
        priceRange: '₦1000 - ₦1200',
        image: require("../../assets/images/busImage.png")
    }
];

function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [voiceModalVisible, setVoiceModalVisible] = useState(false);

    const handleSearchPress = () => {
        // Navigate to RouteSelect modal, passing the selected mode if any
        router.push({
            pathname: "/route/RouteSelect",
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
                <Text style={styles.sectionTitle}>Mode Selector</Text>
                <ModeOfTransportSelect
                    selectedMode={selectedMode}
                    onSelect={(mode) => setSelectedMode(mode)}
                />

                {/* Scrollable Cards Section */}
                {/* <Text style={styles.sectionTitle}>Discover</Text> */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 25 }}>
                    <View style={[styles.featureCard, { backgroundColor: "#014C1D" }]}>
                        <View style={styles.cardLeft}>
                            <Text style={styles.cardTitle}>Just finished a trip?</Text>
                            <Text style={styles.cardDescription}>
                                Share your fare to help other commuters plan better.
                            </Text>
                            <TouchableOpacity style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Share Fare</Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={require("../../assets/images/contributeAndEarnImage.png")}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={[styles.featureCard, { backgroundColor: "#080808" }]}>
                        <View style={styles.cardLeft}>
                            <Text style={styles.cardTitle}>Get Real Estimates</Text>
                            <Text style={styles.cardDescription}>
                                Check what others paid for your route before moving.
                            </Text>
                            <TouchableOpacity style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Check Fares</Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={require("../../assets/images/estimate.png")}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={[styles.featureCard, { backgroundColor: "#009688" }]}>
                        <View style={styles.cardLeft}>
                            <Text style={styles.cardTitle}>Save Time</Text>
                            <Text style={styles.cardDescription}>
                                Quickly find previous routes and their price trends.
                            </Text>
                            <TouchableOpacity style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Explore</Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={require("../../assets/images/speed.png")}
                            style={styles.cardImage}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>

                {/* Shared by commuters near you */}
                <Text style={styles.sectionTitle}>Shared by commuters near you</Text>
                <View style={styles.feedContainer}>
                    {sharedFares.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.feedCard,
                                index === 0 && styles.firstFeedCard,
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
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    logo: {
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
        fontWeight: "500",
        marginBottom: 10,
        color: "#080808",
        marginTop: 20,
    },
    featureCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        width: 320,
        height: 150,
    },
    cardLeft: {
        flex: 1,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    cardDescription: {
        color: "#fff",
        fontSize: 13,
        marginBottom: 10,
        lineHeight: 18,
    },
    shareButton: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignSelf: "flex-start",
    },
    shareButtonText: {
        color: "#333",
        fontWeight: "600",
    },
    cardImage: {
        width: 80,
        height: 80,
        marginLeft: 10,
    },
    feedContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    feedCard: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
    },
    firstFeedCard: {
        borderTopWidth: 1,
        borderTopColor: '#F2F2F2',
    },
    feedCardLeft: {
        marginRight: 12,
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
        marginBottom: 4,
    },
    routeDestinationText: {
        fontWeight: '600',
        color: '#080808',
    },
    feedMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    feedMetaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    feedCardRight: {
        alignItems: 'flex-end',
    },
    feedPriceText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#014C1D',
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