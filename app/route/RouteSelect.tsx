import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModeOfTransportSelect from '@/components/ModeOfTransportSelect';

const { width } = Dimensions.get('window');

// Mock Data for Recommendations
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

function RouteSelect() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [fromFocused, setFromFocused] = useState(false);
    const [toFocused, setToFocused] = useState(false);

    // Check if mode was passed from previous screen
    const initialMode = params.mode as string | undefined;
    const [selectedMode, setSelectedMode] = useState<string | null>(initialMode || null);

    // If initialMode exists, we hide the selector by default logic
    const showTransportSelector = !initialMode;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerSpacer} />
                        <Text style={styles.headerTitle}>Search Result</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Location Inputs */}
                    <View style={styles.inputsSection}>
                        <View style={styles.locationContainer}>
                            <TextInput
                                style={[styles.locationInput, fromFocused && styles.locationInputFocused]}
                                placeholder="From where"
                                placeholderTextColor="#999"
                                value={fromLocation}
                                onChangeText={setFromLocation}
                                onFocus={() => setFromFocused(true)}
                                onBlur={() => setFromFocused(false)}
                            />

                            <View style={styles.toInputWrapper}>
                                <TextInput
                                    style={[styles.locationInput, styles.toLocationInput, toFocused && styles.locationInputFocused]}
                                    placeholder="To where"
                                    placeholderTextColor="#999"
                                    value={toLocation}
                                    onChangeText={setToLocation}
                                    onFocus={() => setToFocused(true)}
                                    onBlur={() => setToFocused(false)}
                                />

                                <View style={styles.connectorArrow}>
                                    <Ionicons name="arrow-down" size={18} color="#fff" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Transport Mode Selection (Conditional) */}
                    {showTransportSelector && (
                        <View style={styles.modeSection}>
                            <Text style={styles.sectionTitle}>Select transport mode</Text>
                            <ModeOfTransportSelect
                                selectedMode={selectedMode}
                                onSelect={setSelectedMode}
                            />
                        </View>
                    )}

                    {/* Recommendations List */}
                    <ScrollView contentContainerStyle={styles.resultsList} showsVerticalScrollIndicator={false}>
                        {recommendations.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.resultCard}>
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
    modalContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerSpacer: {
        width: 24, // Matches close button size for centering
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    inputsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
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
    },
    toInputWrapper: {
        position: 'relative',
    },
    toLocationInput: {
        marginBottom: 0,
    },
    connectorArrow: {
        position: 'absolute',
        right: 12,
        top: '-5%',
        marginTop: -16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modeSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
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

export default RouteSelect;