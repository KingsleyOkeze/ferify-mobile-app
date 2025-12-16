// RouteBreakdownScreen.tsx
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    Keyboard,
} from 'react-native';
import axios from 'axios';

interface Place {
    name: string;
    place_id: string;
}

interface RouteStep {
    instruction: string;
    distance: { text: string };
    duration: { text: string };
    travel_mode: 'TRANSIT' | 'WALKING' | 'DRIVING' | 'BICYCLING';
    transit_details?: {
        line: { name: string };
        departure_stop: { name: string };
    };
}

const RouteBreakdownScreen: React.FC = () => {
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [originId, setOriginId] = useState<string>('');
    const [destinationId, setDestinationId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);

    // Track which field is currently active
    const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const searchPlaces = (query: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            if (query.trim().length < 3) {
                setSuggestions([]);
                setSuggestionsLoading(false);
                return;
            }

            setSuggestionsLoading(true);

            try {
                const res = await axios.get<{ result: Place[] }>('/api/route/placesearch', {
                    params: { query: query.trim() },
                });
                setSuggestions(res.data.result || []);
            } catch (err) {
                console.log('Search failed');
                setSuggestions([]);
            } finally {
                setSuggestionsLoading(false);
            }
        }, 300);
    };

    const selectPlace = (place: Place) => {
        if (activeField === 'origin') {
            setOrigin(place.name);
            setOriginId(place.place_id);
        } else if (activeField === 'destination') {
            setDestination(place.name);
            setDestinationId(place.place_id);
        }
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const getDirections = async () => {
        if (!originId || !destinationId) {
            setError('Please select both origin and destination from suggestions');
            return;
        }

        setLoading(true);
        setError('');
        setRouteSteps([]);

        try {
            const res = await axios.post<{ route: RouteStep[] }>('/api/route/route-breakdown', {
                origin: originId,
                destination: destinationId,
                mode: 'transit',
            },
            {
                timeout: 60000, 
            }
        );
            console.log("route break down result", res.data.route)
            setRouteSteps(res.data.route || []);
        } catch (err: any) {
            console.log("error getting routes breakdown", err)
            setError('No route found. Try different locations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Find Your Route</Text>

            <View style={styles.card}>
                {/* ORIGIN */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>From</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Ikeja, Lagos"
                        value={origin}
                        onChangeText={(text) => {
                            setOrigin(text);
                            searchPlaces(text);
                        }}
                        onFocus={() => setActiveField('origin')}
                    />
                </View>

                {/* DESTINATION */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>To</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Lekki Phase 1"
                        value={destination}
                        onChangeText={(text) => {
                            setDestination(text);
                            searchPlaces(text);
                        }}
                        onFocus={() => setActiveField('destination')}
                    />
                </View>

                {/* SUGGESTIONS + LOADING */}
                {(suggestions.length > 0 || suggestionsLoading) && (
                    <View style={styles.suggestionsCard}>
                        {suggestionsLoading && (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator size="small" color="#64748b" />
                                <Text style={styles.loadingText}>Searching places...</Text>
                            </View>
                        )}

                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => selectPlace(item)}
                                >
                                    <Text style={styles.suggestionText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={getDirections}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Get Directions</Text>
                    )}
                </TouchableOpacity>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* RESULTS */}
            <FlatList
                data={routeSteps}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.stepCard}>
                        <View style={styles.stepHeader}>
                            <View style={styles.stepCircle}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                            </View>
                            {index < routeSteps.length - 1 && <View style={styles.stepLine} />}
                        </View>

                        <View style={styles.stepContent}>
                            <Text style={styles.instruction}>
                                {item.instruction.replace(/<[^>]*>/g, '')}
                            </Text>
                            <Text style={styles.details}>
                                {item.duration.text} • {item.distance.text}
                            </Text>
                            {item.travel_mode === 'TRANSIT' && item.transit_details && (
                                <Text style={styles.transitInfo}>
                                    {item.transit_details.line.name} from {item.transit_details.departure_stop.name}
                                </Text>
                            )}
                        </View>
                    </View>
                )}
                style={styles.resultsList}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    routeSteps.length === 0 && !loading ? (
                        <Text style={styles.emptyText}>
                            Type your origin and destination, then tap "Get Directions"
                        </Text>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    title: { fontSize: 32, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginTop: 50, marginBottom: 20 },
    card: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 12 }, shadowRadius: 20, elevation: 20 },
    label: { fontSize: 15, color: '#475569', marginBottom: 8, fontWeight: '600' },
    inputContainer: { marginBottom: 16 },
    input: { backgroundColor: '#f8fafc', paddingHorizontal: 18, paddingVertical: 16, borderRadius: 16, fontSize: 17, borderWidth: 1.5, borderColor: '#e2e8f0' },
    suggestionsCard: { maxHeight: 340, backgroundColor: '#fff', borderRadius: 16, marginTop: 12, borderWidth: 1.5, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 10 },
    loadingRow: { flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginLeft: 10, color: '#64748b', fontSize: 15 },
    suggestionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f2937' },
    suggestionText: { fontSize: 16.5, color: '#1e293b' },
    button: { backgroundColor: '#2563eb', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 24 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    errorText: { color: '#dc2626', textAlign: 'center', marginTop: 16, fontSize: 16 },
    resultsList: { flex: 1, marginTop: 24, paddingHorizontal: 20 },
    stepCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
    stepHeader: { alignItems: 'center', marginRight: 16 },
    stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
    stepNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    stepLine: { width: 2, flex: 1, backgroundColor: '#cbd5e1', marginTop: 8 },
    stepContent: { flex: 1 },
    instruction: { fontSize: 17, color: '#1e293b', lineHeight: 25, marginBottom: 6 },
    details: { fontSize: 14.5, color: '#64748b' },
    transitInfo: { fontSize: 15.5, color: '#2563eb', fontWeight: '600', marginTop: 8 },
    emptyText: { textAlign: 'center', color: '#94a3b8', fontSize: 17, marginTop: 40 },
});

export default RouteBreakdownScreen;