import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModeOfTransportSelect from '@/components/ModeOfTransportSelect';
import api from '@/services/api';

import LocationInputs from '@/components/LocationInputs';     // ← added
import LocationList from '@/components/LocationList';         // ← added

const { width } = Dimensions.get('window');

interface Recommendation {
    name: string;
    place_id: string;
}

function RouteSelectScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isAndroid = Platform.OS === 'android';

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

    const toInputRef = useRef<TextInput>(null);

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
                params: { query: text }
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
                Alert.alert("Selection Required", "Please select a transport mode to continue.");
            }
        }
    };

    const performFareCheck = async (from: Recommendation, to: Recommendation, mode: string) => {
        try {
            setIsSearching(true);
            const response = await api.get('/api/fare/estimate', {
                params: {
                    from: from.name,
                    to: to.name,
                    vehicle: mode
                }
            });

            router.push({
                pathname: "/route/RouteSummaryScreen",
                params: {
                    from: from.name,
                    to: to.name,
                    mode: mode,
                    fareData: JSON.stringify(response.data)
                }
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

    const Wrapper = isAndroid ? View : SafeAreaView;

    return (
        <Wrapper style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>

                    {/* Top Gap - Adjust height here, and everything below will move with it */}
                    {isAndroid && (
                        <Pressable style={styles.topGap} onPress={() => router.back()} />
                    )}

                    {/* THE CARD GROUP: Everything inside here moves as one unit */}
                    <View style={styles.cardGroup}>

                        {/* The Back Card - Now anchored to the Group, not the Screen */}
                        <View style={styles.backCard} />

                        {/* Main White Card */}
                        <View style={styles.modalContent}>
                            <View style={styles.dragHandleContainer}>
                                <View style={styles.dragHandle} />
                            </View>

                            <View style={styles.header}>
                                <View style={styles.headerSpacer} />
                                <Text style={styles.headerTitle}>Route Select</Text>
                                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {/* Replaced input section with LocationInputs component */}
                            <LocationInputs
                                fromLocation={fromLocation}
                                toLocation={toLocation}
                                fromFocused={fromFocused}
                                toFocused={toFocused}
                                fromResult={!!fromResult}           // boolean
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

                            <View style={styles.modeOfTransportContainer}>
                                {showTransportSelector && (
                                    <View style={styles.modeSection}>
                                        <Text style={styles.sectionTitle}>Select transport mode</Text>
                                        <ModeOfTransportSelect
                                            selectedMode={selectedMode}
                                            onSelect={setSelectedMode}
                                        />
                                    </View>
                                )}

                                {isSearching && !recommendations.length && (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <ActivityIndicator size="small" color="#000" />
                                    </View>
                                )}
                            </View>

                            {/* Replaced results list with LocationList component */}
                            <LocationList
                                isSearching={isSearching}
                                recommendations={recommendations}
                                onSelect={handleSelectRecommendation}
                            />

                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : 'transparent',
    },
    content: {
        flex: 1,
    },
    topGap: {
        height: Platform.OS === 'android' ? 20 : 0,
    },
    cardGroup: {
        flex: 1,
        position: 'relative',
    },
    backCard: {
        position: 'absolute',
        top: -10,
        left: 16,
        right: 16,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        zIndex: -1,
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#FBFBFB',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Platform.select({
            android: { elevation: 20 }
        })
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
    headerSpacer: { width: 24 },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: '700', 
        fontFamily: 'BrittiSemibold',
        color: '#000000' 
    },
    closeButton: { padding: 4 },
    modeSection: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 12 },

    modeOfTransportContainer: {
        marginVertical: 20,
    }
});

export default RouteSelectScreen;