import React, { useState, useEffect, useRef } from 'react';
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
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
    Platform,
    Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModeOfTransportSelect from '@/components/ModeOfTransportSelect';
import api from '@/services/api';

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

                            <View style={styles.inputsSection}>
                                <View style={styles.locationContainer}>
                                    <TextInput
                                        style={[styles.locationInput, fromFocused && styles.locationInputFocused]}
                                        placeholder="From where"
                                        placeholderTextColor="#999"
                                        value={fromLocation}
                                        onChangeText={(text) => handleSearch(text, 'from')}
                                        onFocus={() => {
                                            setFromFocused(true);
                                            setActiveInput('from');
                                        }}
                                        onBlur={() => setFromFocused(false)}
                                    />

                                    <View style={styles.toInputWrapper}>
                                        <TextInput
                                            ref={toInputRef}
                                            style={[
                                                styles.locationInput,
                                                styles.toLocationInput,
                                                toFocused && styles.locationInputFocused,
                                                !fromResult && { opacity: 0.5 }
                                            ]}
                                            placeholder="To where"
                                            placeholderTextColor="#999"
                                            value={toLocation}
                                            editable={!!fromResult}
                                            onChangeText={(text) => handleSearch(text, 'to')}
                                            onFocus={() => {
                                                if (!fromResult) {
                                                    Alert.alert("Information", "Please select a starting point first.");
                                                    return;
                                                }
                                                setToFocused(true);
                                                setActiveInput('to');
                                            }}
                                            onBlur={() => setToFocused(false)}
                                        />
                                        <View style={[styles.connectorArrow, !fromResult && { backgroundColor: '#999' }]}>
                                            <Ionicons name="arrow-down" size={18} color="#fff" />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {showTransportSelector && (
                                <View style={styles.modeSection}>
                                    <Text style={styles.sectionTitle}>Select transport mode</Text>
                                    <ModeOfTransportSelect
                                        selectedMode={selectedMode}
                                        onSelect={setSelectedMode}
                                    />
                                </View>
                            )}

                            {isSearching && (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#000" />
                                </View>
                            )}

                            <ScrollView contentContainerStyle={styles.resultsList} showsVerticalScrollIndicator={false}>
                                {recommendations.map((item) => (
                                    <TouchableOpacity
                                        key={item.place_id}
                                        style={styles.resultCard}
                                        onPress={() => handleSelectRecommendation(item)}
                                    >
                                        <View style={styles.iconContainer}>
                                            <Ionicons name="location-sharp" size={20} color="#000" />
                                        </View>
                                        <View style={styles.resultDetails}>
                                            <Text style={styles.resultTitle}>{item.name}</Text>
                                            <Text style={styles.resultAddress}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
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
        top: -10, // Anchor it relative to the main card's top
        left: 16,
        right: 16,
        height: 40, // Height of the peek
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        zIndex: -1, // Sits behind main content
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    closeButton: { padding: 4 },
    inputsSection: { paddingHorizontal: 20, marginBottom: 24 },
    locationContainer: { position: 'relative' },
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
    locationInputFocused: { borderColor: '#000' },
    toInputWrapper: { position: 'relative' },
    toLocationInput: { marginBottom: 0 },
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
        elevation: 3,
    },
    modeSection: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 12 },
    resultsList: { paddingHorizontal: 20, paddingBottom: 40 },
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
    resultDetails: { flex: 1, marginRight: 12 },
    resultTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
    resultAddress: { fontSize: 14, color: '#666' },
});

export default RouteSelectScreen;