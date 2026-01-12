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

function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [selectedMode, setSelectedMode] = useState<string | null>(null);

    const handleSearchPress = () => {
        // Navigate to RouteSelect modal, passing the selected mode if any
        router.push({
            pathname: "/RouteSelect",
            params: selectedMode ? { mode: selectedMode } : {}
        });
    };

    return (
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

                <TouchableOpacity onPress={() => console.log('Mic pressed')}>
                    <Ionicons name="mic" size={20} color="#666" style={styles.micIcon} />
                </TouchableOpacity>
            </View>

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

            {/* Saved Routes */}
            <Text style={styles.sectionTitle}>Saved Routes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.blankCard}>
                    <Text style={styles.plusText}>+</Text>
                </View>
                <View style={styles.blankCard}>
                    <Text style={styles.plusText}>+</Text>
                </View>
            </ScrollView>

            {/* Shared by commuters */}
            <Text style={styles.sectionTitle}>Shared by commuters near you</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.greyCard}></View>
                <View style={styles.greyCard}></View>
            </ScrollView>
        </ScrollView>
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
    blankCard: {
        width: 96,
        height: 64,
        borderRadius: 10,
        // backgroundColor: "#f2f2f2",
        borderColor: "#EBEDEF",
        borderWidth: 2,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    plusText: {
        fontSize: 28,
        color: "#CECECE",
        fontWeight: "bold",
    },
    greyCard: {
        width: 239,
        height: 97,
        backgroundColor: "#F2F2F2",
        borderRadius: 12,
        marginRight: 16,
        marginBottom: 25
    },
});


export default HomeScreen;