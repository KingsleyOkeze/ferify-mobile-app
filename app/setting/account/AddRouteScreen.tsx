import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock Data for Recommendations (reused from RouteSelect)
const recommendations = [
    {
        id: '1',
        title: 'Ikeja City Mall',
        address: 'Obafemi Awolowo Way, Ikeja',
        distance: '5km',
    },
    {
        id: '2',
        title: 'Computer Village',
        address: 'Otigba Street, Ikeja',
        distance: '3.2km',
    },
    {
        id: '3',
        title: 'Murtala Muhammed Airport',
        address: 'Ikeja, Lagos',
        distance: '8km',
    },
    {
        id: '4',
        title: 'Alausa Secretariat',
        address: 'Alausa, Ikeja',
        distance: '2km',
    },
    {
        id: '5',
        title: 'Allen Avenue',
        address: 'Allen, Ikeja',
        distance: '4km',
    },
];

function AddRouteScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams(); // 'home' or 'work'

    const [toLocation, setToLocation] = useState('');
    const [toFocused, setToFocused] = useState(false);

    // Dynamic Title
    const pageTitle = type === 'work' ? 'Add work' : 'Add home';

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>{pageTitle}</Text>

                        <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Address Input */}
                    <View style={styles.inputsSection}>
                        <View style={styles.locationContainer}>
                            <TextInput
                                style={[styles.locationInput, toFocused && styles.locationInputFocused]}
                                placeholder={`Enter ${type === 'work' ? 'work' : 'home'} address`}
                                placeholderTextColor="#999"
                                value={toLocation}
                                onChangeText={setToLocation}
                                onFocus={() => setToFocused(true)}
                                onBlur={() => setToFocused(false)}
                                autoFocus
                            />
                        </View>
                    </View>

                    {/* Recommendations List */}
                    <Text style={styles.sectionTitle}>Suggestions</Text>
                    <ScrollView
                        contentContainerStyle={styles.resultsList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {recommendations.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.resultCard}
                                onPress={() => {
                                    // Normally this would save the route
                                    router.back();
                                }}
                            >
                                {/* Left: Icon */}
                                <View style={styles.iconContainer}>
                                    <Ionicons name="location-sharp" size={20} color="#000" />
                                </View>

                                {/* Middle: Details */}
                                <View style={styles.resultDetails}>
                                    <Text style={styles.resultTitle}>{item.title}</Text>
                                    <Text style={styles.resultAddress}>{item.address}</Text>
                                </View>

                                {/* Right: Distance */}
                                <View style={styles.distanceBadge}>
                                    <Text style={styles.distanceText}>{item.distance}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    inputsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    locationContainer: {
        position: 'relative',
    },
    locationInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    locationInputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    toLocationInput: {
        marginBottom: 0,
    },
    // connectorArrow removed as we now have a single input
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 10,
    },
    resultsList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    resultDetails: {
        flex: 1,
        marginRight: 12,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    resultAddress: {
        fontSize: 14,
        color: '#666',
    },
    distanceBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    distanceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
});

export default AddRouteScreen;
