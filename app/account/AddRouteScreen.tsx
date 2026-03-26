import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

function AddRouteScreen() {
    const router = useRouter();
    const { type } = useLocalSearchParams(); // 'home' or 'work'

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Fetch suggestions from backend
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get('/api/location/suggest', {
                    params: { input: query }
                });
                if (response.data && response.data.suggestions) {
                    setSuggestions(response.data.suggestions);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSaveRoute = async (item: any) => {
        setIsSaving(true);
        try {
            const payload = {
                type: type,
                title: item.title,
                address: item.address,
                latitude: item.latitude || 0,
                longitude: item.longitude || 0
            };

            const response = await api.post('/api/user/route/save-route', payload);

            if (response.status === 200) {
                // Save to local storage
                await AsyncStorage.setItem(`${type}_address`, item.address);
                Alert.alert('Success', `${type === 'home' ? 'Home' : 'Work'} address saved!`);
                router.back();
            }
        } catch (error: any) {
            console.error('Error saving route:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

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
                                style={[styles.locationInput, isFocused && styles.locationInputFocused]}
                                placeholder={`Enter ${type === 'work' ? 'work' : 'home'} address`}
                                placeholderTextColor="#999"
                                value={query}
                                onChangeText={setQuery}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                autoFocus
                            />
                            {isLoading && (
                                <ActivityIndicator
                                    style={styles.inputLoader}
                                    size="small"
                                    color="#000"
                                />
                            )}
                        </View>
                    </View>

                    {/* Suggestions List */}
                    <Text style={styles.sectionTitle}>
                        {suggestions.length > 0 ? 'Suggestions' : (query.length >= 3 ? 'No results found' : 'Start typing to see suggestions')}
                    </Text>

                    <ScrollView
                        contentContainerStyle={styles.resultsList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {suggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.resultCard}
                                onPress={() => handleSaveRoute(item)}
                                disabled={isSaving}
                            >
                                <View style={styles.iconContainer}>
                                    <Ionicons name="location-sharp" size={20} color="#000" />
                                </View>

                                <View style={styles.resultDetails}>
                                    <Text style={styles.resultTitle}>{item.title}</Text>
                                    <Text style={styles.resultAddress}>{item.address}</Text>
                                </View>

                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {isSaving && (
                        <View style={styles.savingOverlay}>
                            <ActivityIndicator size="large" color="#000" />
                            <Text style={styles.savingText}>Saving...</Text>
                        </View>
                    )}
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
        justifyContent: 'center',
    },
    locationInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingRight: 40, 
        fontSize: 16,
        color: '#000',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    locationInputFocused: {
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    inputLoader: {
        position: 'absolute',
        right: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
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
    savingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    savingText: {
        marginTop: 10,
        fontWeight: '600',
        color: '#000',
    },
});

export default AddRouteScreen;
