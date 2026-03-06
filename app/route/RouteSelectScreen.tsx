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
import { useLoader } from '@/contexts/LoaderContext';
import { useToast } from '@/contexts/ToastContext';

import LocationInputs from '@/components/LocationInputs';     // ← added
import LocationRecommendation from '@/components/LocationRecommendation';         // ← added
import { getCachedLocation, fetchAndCacheLocation } from '@/services/locationService';

const { width } = Dimensions.get('window');

interface Recommendation {
    name: string;
    place_id: string;
}

function RouteSelectScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isAndroid = Platform.OS === 'android';
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useToast();

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
            const data = response.data;
            setRecommendations(Array.isArray(data) ? data : (data?.result || []));
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
                showToast('general', 'Please select a transport mode to continue.');
            }
        }
    };

    const performFareCheck = async (from: Recommendation, to: Recommendation, mode: string) => {
        try {
            showLoader();
            const response = await api.get('/api/fare/estimate', {
                params: {
                    from: from.name,
                    to: to.name,
                    vehicle: mode
                }
            });

            router.push({
                pathname: "/route/RouteResultScreen",
                params: {
                    from: from.name,
                    to: to.name,
                    fromId: from.place_id,
                    toId: to.place_id,
                    mode: mode,
                    fareData: JSON.stringify(response?.data)
                }
            });
        } catch (error: any) {
            console.error('Fare check error:', error);

            // If it's a 404 (No data found), we still navigate but with null fare data
            if (error.response?.status === 404) {
                router.push({
                    pathname: "/route/RouteResultScreen",
                    params: {
                        from: from.name,
                        to: to.name,
                        fromId: from.place_id,
                        toId: to.place_id,
                        mode: mode,
                        fareData: null,
                        errorMessage: error.response?.data?.message || "No fare data found"
                    }
                });
            } else {
                showToast('error', 'Could not calculate fare estimate. Please try again.');
            }
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        if (fromResult && toResult && selectedMode) {
            performFareCheck(fromResult, toResult, selectedMode);
        }
    }, [selectedMode]);

    // Handle initial parameters and Location Auto-fill
    useEffect(() => {
        const init = async () => {
            const { initialFrom, initialTo } = params;

            // Handle "From" Location
            if (initialFrom) {
                setFromLocation(initialFrom as string);
                setFromResult({
                    name: initialFrom as string,
                    place_id: 'current_location'
                });
            } else {
                // AUTO-FILL CURRENT LOCATION (Industry Standard: Optimistic + Fresh)
                // A. Optimistic: specific for speed
                const cached = await getCachedLocation();
                if (cached && cached.address) {
                    setFromLocation(cached.address);
                    setFromResult({
                        name: cached.address,
                        place_id: 'current_location'
                    });
                }

                // Freshness: Refresh in background to ensure accuracy
                // Request a fresh location if the cached one is older than 60 seconds
                fetchAndCacheLocation(60000).then((fresh) => {
                    if (fresh && fresh.address && fresh.address !== cached?.address) {
                        setFromLocation(fresh.address);
                        setFromResult({
                            name: fresh.address,
                            place_id: 'current_location'
                        });
                    }
                });
            }

            // Handle "To" Location (e.g. from Voice Search)
            if (initialTo) {
                setToLocation(initialTo as string);
                // Trigger search for the destination immediately
                handleSearch(initialTo as string, 'to');

                // Focus the destination input to let user select from list
                // We add a slight delay to ensure UI is ready and validation doesn't clash
                setTimeout(() => {
                    setActiveInput('to');
                    toInputRef.current?.focus();
                }, 800);
            }
        };

        init();
    }, [params.initialFrom, params.initialTo]);

    const handleFromSubmit = () => {
        // If user hits 'Next' on "From" input
        if (activeInput === 'from') {
            // If explicit result not chosen but text exists, try to pick top recommendation
            if (!fromResult && recommendations.length > 0) {
                handleSelectRecommendation(recommendations[0]);
                // handleSelectRecommendation will auto-focus "To"
            } else if (fromResult) {
                // If already valid, just move focus
                toInputRef.current?.focus();
            }
        }
    };

    const handleToSubmit = () => {
        Keyboard.dismiss();
        if (activeInput === 'to') {
            // Case 1: Result selected, Mode selected -> Check Fare
            if (toResult && fromResult && selectedMode) {
                performFareCheck(fromResult, toResult, selectedMode);
                return;
            }

            // Case 2: No result selected (user typed), but we have matches
            if (!toResult && recommendations.length > 0 && fromResult) {
                // Determine which recommendation to pick (Top one)
                const topMatch = recommendations[0];
                handleSelectRecommendation(topMatch);
                return;
            }

            // Case 3: Mode missing
            if ((toResult || (recommendations.length > 0)) && !selectedMode) {
                showToast('general', 'Please select a transport mode to continue.');
            }
        }
    };

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
                                <TouchableOpacity
                                    onPress={() => requestAnimationFrame(() => router.back())}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {/* Replaced input section with LocationInputs component */}
                            <View style={styles.locationInputContainer}>
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
                                    onFromSubmit={handleFromSubmit}
                                    onToSubmit={handleToSubmit}
                                    toInputRef={toInputRef}
                                />
                            </View>

                            <View style={styles.modeOfTransportContainer}>
                                {showTransportSelector && (
                                    <View style={styles.modeSection}>
                                        {/* <Text style={styles.sectionTitle}>Select transport mode</Text> */}
                                        <ModeOfTransportSelect
                                            selectedMode={selectedMode}
                                            onSelect={setSelectedMode}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* Replaced results list with LocationRecommendation component */}
                            <LocationRecommendation
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
        // marginTop: 8,
        marginBottom: 24,
    },
    headerSpacer: { width: 24 },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'BrittiSemibold',
        color: '#000000'
    },
    closeButton: {
        padding: 4
    },
    locationInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    modeSection: {
        paddingHorizontal: 20,
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'BrittiSemibold',
        color: '#000',
        marginTop: 12,
        marginBottom: 12
    },

    modeOfTransportContainer: {
        marginTop: 8
    }
});

export default RouteSelectScreen;