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
import { STORAGE_KEYS } from '@/constants/storage';
import { cacheHelper } from '@/utils/cache';
import api from '@/services/api';
import { getLocationPermissionStatus } from '@/services/locationService';

function LocationDataSettingScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('while_using');

    const syncSettingsWithOS = async () => {
        try {
            const status = await getLocationPermissionStatus();

            // If OS permission is denied, the effective state is 'never'
            if (status === 'denied') {
                setSelectedOption('never');
                return true; // Handled
            }
            return false; // Continue with backend/cache sync
        } catch (e) {
            console.error('Error syncing with OS permissions:', e);
            return false;
        }
    };

    const loadSettings = async () => {
        // Check OS Permissions first (Highest Priority)
        const isHandledByOS = await syncSettingsWithOS();
        if (isHandledByOS) return;

        // Load from Cache
        const cached = await cacheHelper.get<{ shareLocationData: boolean }>(STORAGE_KEYS.PRIVACY_SETTINGS, Infinity);
        if (cached) {
            setSelectedOption(cached.shareLocationData ? 'while_using' : 'never');
        }

        // 3. Fetch fresh from Backend
        try {
            const response = await api.get('/api/user/privacy');
            if (response.data && response.data.privacy) {
                const { shareLocationData } = response.data.privacy;
                setSelectedOption(shareLocationData ? 'while_using' : 'never');
                await cacheHelper.set(STORAGE_KEYS.PRIVACY_SETTINGS, response.data.privacy);
            }
        } catch (error) {
            console.error('Error fetching privacy settings:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSettings();
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
                await cacheHelper.set(STORAGE_KEYS.PRIVACY_SETTINGS, response.data.privacy);
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
        marginBottom: 24,
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
