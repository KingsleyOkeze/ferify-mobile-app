
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
    ActivityIndicator
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TimeSelectionModal from './TimeSelectionModal';
import SuccessModal from './SuccessModal';
import RewardsModal from './RewardsModal';
import ModeOfTransportSelect from '../../components/ModeOfTransportSelect';
import LocationInputs from '../../components/LocationInputs';
import { useRouter } from "expo-router";

const { height } = Dimensions.get('window');

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
    // Form state
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
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
    const [rewardsModalVisible, setRewardsModalVisible] = useState(false);

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toInputRef = useRef<TextInput | null>(null);

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

    const handleSubmit = async () => {
        if (isFormValid) {
            setIsSubmitting(true);

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                console.log('Form submitted:', {
                    fromLocation,
                    toLocation,
                    fareAmount,
                    selectedTime,
                    selectedVehicle,
                    selectedConditions,
                    customCondition,
                    notes,
                });

                // Show success modal
                setIsSubmitting(false);
                setSuccessModalVisible(true);
            } catch (error) {
                console.error('Submission error:', error);
                setIsSubmitting(false);
            }
        }
    };

    const handleClaimReward = () => {
        setSuccessModalVisible(false);
        setRewardsModalVisible(true);
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
                <Text style={styles.title}>Update fare</Text>
                <Text style={styles.subtitle}>Help others know the correct price</Text>

                {/* Location Inputs */}
                <LocationInputs
                    fromLocation={fromLocation}
                    toLocation={toLocation}
                    fromFocused={fromFocused}
                    toFocused={toFocused}
                    fromResult={fromLocation.length > 0}
                    onFromChange={setFromLocation}
                    onToChange={setToLocation}
                    onFromFocus={() => setFromFocused(true)}
                    onFromBlur={() => setFromFocused(false)}
                    onToFocus={() => setToFocused(true)}
                    onToBlur={() => setToFocused(false)}
                    toInputRef={toInputRef}
                />

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
                    {[100, 200, 300, 400, 500].map((amount) => (
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
                        Submit Fare
                    </Text>
                </TouchableOpacity>
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

            {/* Rewards Modal */}
            <RewardsModal
                visible={rewardsModalVisible}
                onClose={() => setRewardsModalVisible(false)}
            />

            {/* Loading Overlay */}
            {isSubmitting && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                </View>
            )}
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        color: '#080808',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 400,
        color: '#393939',
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        paddingTop: 35,
        paddingBottom: 16,
    },
    fareInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    nairaSign: {
        fontSize: 16,
        fontWeight: 400,
        color: '#080808',
        marginRight: 8,
    },
    fareInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    quickSelectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickSelectChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#EBEDEF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBEDEF',
    },
    quickSelectText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#080808',
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
        color: '#757575',
        flex: 1,
    },
    placeholderText: {
        color: '#757575',
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
    },
    conditionChipSelected: {
        borderColor: '#6B6B6B',
    },
    conditionChipText: {
        fontSize: 14,
        color: '#080808',
    },
    conditionChipTextSelected: {
        fontWeight: '600',
    },
    notesInput: {
        backgroundColor: '#F2F3F4',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        minHeight: 97,
        marginBottom: 32,
    },
    submitButton: {
        backgroundColor: '#000',
        borderRadius: 100,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: '#CECECE',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 600,
        color: '#FBFBFB',
    },
    submitButtonTextDisabled: {
        color: '#979797',
    },
    // Loading Overlay Styles (only thing kept here as it's simple)
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0A0A0A66',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    loadingContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
});

export default FareContributionScreen;
