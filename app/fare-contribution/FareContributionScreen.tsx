
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Animated,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TimeSelectionModal from './TimeSelectionModal';
import SuccessModal from './SuccessModal';
import ModeOfTransportSelect from '../../components/ModeOfTransportSelect';
import LocationInputs from '../../components/LocationInputs';
import LocationRecommendation from '../../components/LocationRecommendation'; // Added
import RouteFromAndTo from '@/components/RouteFromAndTo';
import { useRouter, useLocalSearchParams } from "expo-router";
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { getCachedLocation } from '@/services/locationService';
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';
import { cacheHelper } from '@/utils/cache';
import { STORAGE_KEYS } from '@/constants/storage';


const { height } = Dimensions.get('window');

interface Recommendation {
    name: string;
    place_id: string;
}

interface TimeOption {
    label: string;
    value: string;
}

interface VehicleOption {
    label: string;
    value: string;
    image: any;
}

interface ConditionOption {
    label: string;
    value: string;
}

const timeOptions: TimeOption[] = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' },
    { label: 'Night', value: 'night' },
];

const vehicleOptions: VehicleOption[] = [
    { label: 'Bus', value: 'bus', image: require('@/assets/images/transportation-icons/busImage.png') },
    { label: 'Keke', value: 'keke', image: require('@/assets/images/transportation-icons/kekeImage.png') },
    { label: 'Bike', value: 'bike', image: require('@/assets/images/transportation-icons/okadaImage.png') },
];

const predefinedConditions: ConditionOption[] = [
    { label: 'Rainy weather', value: 'rainy' },
    { label: 'Traffic', value: 'traffic' },
    { label: 'Fuel scarcity', value: 'fuel' },
    { label: 'Road block', value: 'roadblock' },
    { label: 'Holiday', value: 'holiday' },
    { label: 'Strike', value: 'strike' },
    { label: 'Accident', value: 'accident' },
];

function FareContributionScreen() {
    const router = useRouter();
    const { from, to, contributionType } = useLocalSearchParams();

    // Form state
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    useEffect(() => {
        if (from || to) {
            if (from) setFromLocation(from as string);
            if (to) setToLocation(to as string);
        } else {
            const loadInitialLocation = async () => {
                const cached = await getCachedLocation();
                if (cached && cached.address) {
                    setFromLocation(cached.address);
                }
            };
            loadInitialLocation();
        }
    }, [from, to]);
    const [fareAmount, setFareAmount] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTimeLabel, setSelectedTimeLabel] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedVehicleLabel, setSelectedVehicleLabel] = useState('');
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [customCondition, setCustomCondition] = useState('');
    const [notes, setNotes] = useState('');

    // Focus states
    const [fromFocused, setFromFocused] = useState(false);
    const [toFocused, setToFocused] = useState(false);

    // Modal states
    const [timeModalVisible, setTimeModalVisible] = useState(false);
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    const [conditionsModalVisible, setConditionsModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Search State
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

    // Loading state
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();

    const toInputRef = useRef<TextInput | null>(null);

    const handleSearch = async (text: string, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromLocation(text);
        } else {
            setToLocation(text);
        }

        // If user clears input, clear recommendations
        if (text.length < 2) {
            setRecommendations([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get('/api/route/placesearch', {
                params: { query: text }
            });
            const data = response.data;
            setRecommendations(Array.isArray(data) ? data : (data?.result || []));
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectRecommendation = (item: Recommendation) => {
        // Update whichever input is active
        if (activeInput === 'from') {
            setFromLocation(item.name);
            // Optional: Auto-focus to 'to' input if from is selected
            setTimeout(() => {
                setToFocused(true);
                setActiveInput('to');
                toInputRef.current?.focus();
            }, 100);
        } else if (activeInput === 'to') {
            setToLocation(item.name);
            setToFocused(false);
            setActiveInput(null); // Close search
        }

        // Clear search results after selection
        setRecommendations([]);
    };

    // Animation values
    // Kept for consistency if needed, though modals now handle their own animations
    // We can remove this if we want, but passing it down or just letting modals handle it is cleaner.
    // Since I moved animations to specific modals, I don't need slideAnim here anymore for them.
    // However, SuccessModal logic in previous file used it. I kept it in SuccessModal component.
    // So I can remove it from here.

    // Form validation
    const isFormValid = fromLocation.trim() !== '' &&
        toLocation.trim() !== '' &&
        fareAmount.trim() !== '' &&
        selectedTime !== '' &&
        selectedVehicle !== '';

    const openModal = (modalType: 'time' | 'vehicle' | 'conditions') => {
        if (modalType === 'time') {
            setTimeModalVisible(true);
        } else if (modalType === 'vehicle') {
            setVehicleModalVisible(true);
        } else if (modalType === 'conditions') {
            setConditionsModalVisible(true);
        }
    };

    const handleSaveTime = (value: string, label: string) => {
        setSelectedTime(value);
        setSelectedTimeLabel(label);
        setTimeModalVisible(false);
    };

    const handleSaveVehicle = (value: string, label: string) => {
        setSelectedVehicle(value);
        setSelectedVehicleLabel(label);
        setVehicleModalVisible(false);
    };

    const toggleCondition = (value: string) => {
        if (selectedConditions.includes(value)) {
            setSelectedConditions(selectedConditions.filter(c => c !== value));
        } else {
            setSelectedConditions([...selectedConditions, value]);
        }
    };

    const { user } = useAuth();

    const handleSubmit = async () => {
        if (isFormValid) {
            showLoader();

            try {
                // Get real userId from AuthContext
                const userId = user?.id;

                // Get user's current location for the "Near You" feature
                const cachedLocation = await getCachedLocation();
                const location = cachedLocation ? {
                    type: 'Point',
                    coordinates: [cachedLocation.longitude, cachedLocation.latitude]
                } : undefined;

                const payload = {
                    userId,
                    fromLocation: { raw: fromLocation },
                    toLocation: { raw: toLocation },
                    vehicleType: selectedVehicle,
                    fareAmount: Number(fareAmount),
                    timeOfDay: selectedTime,
                    conditions: selectedConditions,
                    notes: notes,
                    location: location,
                    contributionType: contributionType || 'fare_submission'
                };


                const response = await api.post('/api/fare/submit', payload);

                console.log('Fare submitted successfully:', response.data);

                // Invalidate achievement related caches to force fresh fetch
                await Promise.all([
                    cacheHelper.remove(STORAGE_KEYS.BADGES),
                    cacheHelper.remove(STORAGE_KEYS.USER_ACHIEVEMENTS),
                    cacheHelper.remove(STORAGE_KEYS.LEADERBOARD)
                ]);

                // Show success modal
                hideLoader();
                setSuccessModalVisible(true);
            } catch (error: any) {
                console.error('Submission error:', error);
                const errorMessage = error.response?.data?.error || "Could not submit fare. Please try again.";
                showToast('error', errorMessage);
                hideLoader();
            }
        }
    };


    const handleClaimReward = () => {
        setSuccessModalVisible(false);
        // router.replace('/(tabs)/HomeScreen');
    };

    const getConditionsDisplay = () => {
        const allConditions = [...selectedConditions];
        if (customCondition.trim()) {
            allConditions.push(customCondition);
        }
        // Map values to labels for standard conditions
        const displayConditions = allConditions.map(c => {
            const found = predefinedConditions.find(p => p.value === c);
            return found ? found.label : c;
        });

        return displayConditions.length > 0 ? displayConditions.join(', ') : '';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title Section */}
                <Text style={styles.title}>
                    {
                        from && to ? (
                            <Text style={styles.title}>
                                Confirm fare
                            </Text>
                        ) : (
                            <Text style={styles.title}>
                                Update fare
                            </Text>
                        )
                    }
                </Text>
                <Text style={styles.subtitle}>Help others know the correct price</Text>

                {/* Location Inputs - Only show if we're NOT in confirmation mode */}
                {(!from || !to) ? (
                    <LocationInputs
                        fromLocation={fromLocation}
                        toLocation={toLocation}
                        fromFocused={fromFocused}
                        toFocused={toFocused}
                        fromResult={fromLocation.length > 0}
                        onFromChange={(text) => handleSearch(text, 'from')}
                        onToChange={(text) => handleSearch(text, 'to')}
                        onFromFocus={() => {
                            setFromFocused(true);
                            setActiveInput('from');
                        }}
                        onFromBlur={() => setFromFocused(false)}
                        onToFocus={() => {
                            setToFocused(true);
                            setActiveInput('to');
                        }}
                        onToBlur={() => setToFocused(false)}
                        toInputRef={toInputRef}
                    />
                ) : (
                    /* Show this when we are confirming a specific route */
                    <RouteFromAndTo from={fromLocation} to={toLocation} />
                )}

                {/* 
                  Show Recommendation List if:
                  1. We have search results (recommendations.length > 0)
                  2. OR we are currently searching (isSearching)
                  3. OR user is focused on an input and hasn't selected yet (implied by having recommendations)
                  
                  Otherwise show the form content.
                */}
                {(recommendations.length > 0 || isSearching) ? (
                    <View style={{ marginTop: 20 }}>
                        <LocationRecommendation
                            isSearching={isSearching}
                            recommendations={recommendations}
                            onSelect={handleSelectRecommendation}
                        />
                    </View>
                ) : (
                    <>
                        {/* Fare Amount */}
                        <Text style={styles.sectionTitle}>How much did you pay?</Text>
                        <View style={styles.fareInputContainer}>
                            <Text style={styles.nairaSign}>₦</Text>
                            <TextInput
                                style={styles.fareInput}
                                placeholder="Enter fare amount"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={fareAmount}
                                onChangeText={setFareAmount}
                            />
                        </View>

                        {/* Quick Select Chips */}
                        <View style={styles.quickSelectContainer}>
                            {[100, 200, 400, 500, 1000, 1500].map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    style={styles.quickSelectChip}
                                    onPress={() => setFareAmount(amount.toString())}
                                >
                                    <Text style={styles.quickSelectText}>₦{amount}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Time of Route */}
                        <Text style={styles.sectionTitle}>When did you take this route?</Text>
                        <TouchableOpacity
                            style={styles.selectInput}
                            onPress={() => openModal('time')}
                        >
                            <Text style={[styles.selectInputText, !selectedTimeLabel && styles.placeholderText]}>
                                {selectedTimeLabel || 'Select a time'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>

                        {/* Vehicle Selection */}
                        <Text style={styles.sectionTitle}>Select the vehicle you used</Text>
                        <ModeOfTransportSelect
                            selectedMode={selectedVehicle}
                            onSelect={(mode) => {
                                setSelectedVehicle(mode || '');
                                const label = mode ? (vehicleOptions.find(o => o.value === mode)?.label || '') : '';
                                setSelectedVehicleLabel(label);
                            }}
                        />

                        {/* Special Conditions */}
                        <Text style={styles.sectionTitle}>Any special condition? (optional)</Text>
                        <View style={styles.conditionsChipsContainer}>
                            {predefinedConditions.map((condition) => (
                                <TouchableOpacity
                                    key={condition.value}
                                    style={[
                                        styles.conditionChip,
                                        selectedConditions.includes(condition.value) && styles.conditionChipSelected
                                    ]}
                                    onPress={() => toggleCondition(condition.value)}
                                >
                                    <Text style={[
                                        styles.conditionChipText,
                                        selectedConditions.includes(condition.value) && styles.conditionChipTextSelected
                                    ]}>
                                        {condition.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Notes */}
                        <Text style={styles.sectionTitle}>Add a note (optional)</Text>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Add a note"
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={!isFormValid}
                        >
                            <Text style={[styles.submitButtonText, !isFormValid && styles.submitButtonTextDisabled]}>
                                {(from && to) ? "Confirm Fare" : "Submit Fare"}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Time Selection Modal */}
            <TimeSelectionModal
                visible={timeModalVisible}
                onClose={() => setTimeModalVisible(false)}
                onSave={handleSaveTime}
                options={timeOptions}
                currentSelection={selectedTime}
            />

            {/* Success Modal */}
            <SuccessModal
                visible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                onClaimReward={handleClaimReward}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginLeft: -4
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        color: '#080808',
        marginBottom: 8,
        fontFamily: 'BrittiSemibold'
    },
    subtitle: {
        fontSize: 14,
        color: '#393939',
        fontFamily: 'BrittiRegular',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        paddingTop: 32,
        paddingBottom: 16,
    },
    fareInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        marginBottom: 8,
        height: 50
    },
    nairaSign: {
        fontSize: 16,
        color: '#080808',
        marginRight: 8,
        fontFamily: 'BrittiRegular'
    },
    fareInput: {
        flex: 1,
        fontSize: 16,
        color: '#080808',
        fontFamily: 'BrittiRegular'
    },
    quickSelectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    quickSelectChip: {
        height: 37,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBEDEF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    quickSelectText: {
        fontSize: 14,
        color: '#080808',
        fontFamily: 'BrittiRegular'
    },
    selectInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        borderColor: '#EDEDED',
        paddingHorizontal: 16,
        paddingVertical: 14,
        height: 50
    },
    selectInputText: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        flex: 1,
    },
    placeholderText: {
        color: '#757575',
        fontFamily: 'BrittiRegular'
    },
    conditionsChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DADADA',
        justifyContent: 'center',
        alignItems: 'center'
    },
    conditionChipSelected: {
        borderColor: '#6B6B6B',
    },
    conditionChipText: {
        fontSize: 14,
        color: '#080808',
        fontFamily: 'BrittiRegular'
    },
    conditionChipTextSelected: {
        fontFamily: 'BrittiSemibold',
    },
    notesInput: {
        backgroundColor: '#F2F3F4',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#080808',
        fontFamily: 'BrittiRegular',
        minHeight: 97,
        marginBottom: 32,
    },
    submitButton: {
        backgroundColor: '#000',
        borderRadius: 100,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: '#CECECE',
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        color: '#FBFBFB',
    },
    submitButtonTextDisabled: {
        color: '#979797',
    },
});

export default FareContributionScreen;
