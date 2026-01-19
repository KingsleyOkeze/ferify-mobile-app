import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import ModeOfTransportSelect from '@/components/ModeOfTransportSelect';
import LocationInputs from '@/components/LocationInputs';
import LocationList from '@/components/LocationList';

import api from '@/services/api';

interface Recommendation {
    name: string;
    place_id: string;
}

export default function RouteSelect() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Inputs
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [fromFocused, setFromFocused] = useState(false);
    const [toFocused, setToFocused] = useState(false);

    // Selected Objects
    const [fromResult, setFromResult] = useState<Recommendation | null>(null);
    const [toResult, setToResult] = useState<Recommendation | null>(null);

    // Search State
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null);

    // Mode
    const initialMode = params.mode as string | undefined;
    const [selectedMode, setSelectedMode] = useState<string | null>(initialMode || null);
    const showTransportSelector = !initialMode;

    const toInputRef = useRef<TextInput | null>(null);

    const handleSearch = async (text: string, type: 'from' | 'to') => {
        if (type === 'from') {
            setFromLocation(text);
            setFromResult(null);
        } else {
            setToLocation(text);
            setToResult(null);
        }

        if (text.length < 2) {
            setRecommendations([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get('/api/route/placesearch', {
                params: { query: text },
            });
            setRecommendations(response.data || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectRecommendation = (item: Recommendation) => {
        if (activeInput === 'from') {
            setFromLocation(item.name);
            setFromResult(item);
            setRecommendations([]);
            setTimeout(() => toInputRef.current?.focus(), 100);
        } else if (activeInput === 'to') {
            setToLocation(item.name);
            setToResult(item);
            setRecommendations([]);
            Keyboard.dismiss();

            if (fromResult && selectedMode) {
                performFareCheck(fromResult, item, selectedMode);
            } else if (!selectedMode) {
                Alert.alert("Selection Required", "Please select a transport mode.");
            }
        }
    };

    const performFareCheck = async (
        from: Recommendation,
        to: Recommendation,
        mode: string
    ) => {
        try {
            setIsSearching(true);
            const response = await api.get('/api/fare/estimate', {
                params: {
                    from: from.name,
                    to: to.name,
                    vehicle: mode,
                },
            });

            router.push({
                pathname: "/route/RouteSummaryScreen",
                params: {
                    from: from.name,
                    to: to.name,
                    mode: mode,
                    fareData: JSON.stringify(response.data),
                },
            });
        } catch (error) {
            console.error('Fare check error:', error);
            Alert.alert("Error", "Could not calculate fare estimate. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (fromResult && toResult && selectedMode) {
            performFareCheck(fromResult, toResult, selectedMode);
        }
    }, [selectedMode]);

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
                        <Text style={styles.headerTitle}>Route Select</Text>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Location Inputs */}
                    <LocationInputs
                        fromLocation={fromLocation}
                        toLocation={toLocation}
                        fromFocused={fromFocused}
                        toFocused={toFocused}
                        fromResult={!!fromResult}
                        onFromChange={(text) => handleSearch(text, 'from')}
                        onToChange={(text) => handleSearch(text, 'to')}
                        onFromFocus={() => {
                            setFromFocused(true);
                            setActiveInput('from');
                        }}
                        onToFocus={() => {
                            setToFocused(true);
                            setActiveInput('to');
                        }}
                        onFromBlur={() => setFromFocused(false)}
                        onToBlur={() => setToFocused(false)}
                        toInputRef={toInputRef}
                    />

                    {/* Transport Mode (if needed) */}
                    {showTransportSelector && (
                        <View style={styles.modeSection}>
                            <Text style={styles.sectionTitle}>Select transport mode</Text>
                            <ModeOfTransportSelect
                                selectedMode={selectedMode}
                                onSelect={setSelectedMode}
                            />
                        </View>
                    )}

                    {/* Search Results */}
                    <LocationList
                        isSearching={isSearching}
                        recommendations={recommendations}
                        onSelect={handleSelectRecommendation}
                    />
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
        width: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    closeButton: {
        padding: 4,
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
});