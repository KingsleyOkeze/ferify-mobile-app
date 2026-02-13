import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

function LocationDataSettingScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('while_using');

    const loadCachedSettings = async () => {
        try {
            const cached = await AsyncStorage.getItem('user_privacy_settings');
            if (cached) {
                const parsed = JSON.parse(cached);
                setSelectedOption(parsed.shareLocationData ? 'while_using' : 'never');
            }
        } catch (e) {
            console.error('Error loading cached settings:', e);
        }
    };

    const fetchPrivacySettings = async () => {
        try {
            const response = await api.get('/api/user/privacy');
            if (response.data && response.data.privacy) {
                const { shareLocationData } = response.data.privacy;
                setSelectedOption(shareLocationData ? 'while_using' : 'never');
                await AsyncStorage.setItem('user_privacy_settings', JSON.stringify(response.data.privacy));
            }
        } catch (error) {
            console.error('Error fetching privacy settings:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCachedSettings();
            fetchPrivacySettings();
        }, [])
    );

    const updateLocationPreference = async (optionId: string) => {
        const previousSelection = selectedOption;
        setSelectedOption(optionId); // Optimistic update

        try {
            const isSharing = optionId !== 'never';
            const response = await api.patch('/api/user/privacy/update', {
                shareLocationData: isSharing
            });
            if (response.data && response.data.privacy) {
                await AsyncStorage.setItem('user_privacy_settings', JSON.stringify(response.data.privacy));
            }
        } catch (error) {
            console.error('Error updating location preference:', error);
            setSelectedOption(previousSelection); // Rollback
            alert('Failed to update location settings. Please try again.');
        }
    };

    const locationOptions = [
        {
            id: 'always',
            title: 'Always Allow',
            description: 'Best for real-time tracking and alerts',
        },
        {
            id: 'while_using',
            title: 'While Using App',
            description: 'Standard privacy choice',
        },
        {
            id: 'never',
            title: 'Never',
            description: 'Disables all location features',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Location data</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Options List */}
                <View style={styles.listContainer}>
                    {locationOptions.map((option, index) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.listItem,
                                    index === 0 && styles.firstListItem
                                ]}
                                onPress={() => updateLocationPreference(option.id)}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{option.title}</Text>
                                    <Text style={styles.itemDescription}>{option.description}</Text>
                                </View>

                                {/* Radio Checkmark */}
                                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Footer Text */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Manage how we use your location to{'\n'}improve your commute.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'BrittiSemibold',
        fontWeight: 600,
        color: '#080808',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    listContainer: {
        // paddingHorizontal: 20, 
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        color: '#666',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    footerContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'flex-end',
    },
    footerText: {
        textAlign: 'right',
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

export default LocationDataSettingScreen;
