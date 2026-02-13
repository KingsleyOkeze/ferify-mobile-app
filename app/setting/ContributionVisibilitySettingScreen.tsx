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

function ContributionVisibilitySettingScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('everyone');

    const loadCachedSettings = async () => {
        try {
            const cached = await AsyncStorage.getItem('user_privacy_settings');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.contributionVisibility) setSelectedOption(parsed.contributionVisibility);
            }
        } catch (e) {
            console.error('Error loading cached settings:', e);
        }
    };

    const fetchPrivacySettings = async () => {
        try {
            const response = await api.get('/api/user/privacy');
            if (response.data && response.data.privacy) {
                const { contributionVisibility } = response.data.privacy;
                setSelectedOption(contributionVisibility);
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

    const updateVisibility = async (optionId: string) => {
        const previousSelection = selectedOption;
        setSelectedOption(optionId); // Optimistic update

        try {
            const response = await api.patch('/api/user/privacy/update', {
                contributionVisibility: optionId
            });
            if (response.data && response.data.privacy) {
                await AsyncStorage.setItem('user_privacy_settings', JSON.stringify(response.data.privacy));
            }
        } catch (error) {
            console.error('Error updating contribution visibility:', error);
            setSelectedOption(previousSelection); // Rollback
            alert('Failed to update visibility. Please try again.');
        }
    };

    const visibilityOptions = [
        {
            id: 'everyone',
            title: 'Show my name',
            description: 'Chiamaka @amakaoddy',
        },
        {
            id: 'community',
            title: 'Show badge only',
            description: 'Trusted contributor',
        },
        {
            id: 'private',
            title: 'Show anonymously',
            description: 'Private contributor',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contribution visibility</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Options List */}
                <View style={styles.listContainer}>
                    {visibilityOptions.map((option, index) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.listItem,
                                    index === 0 && styles.firstListItem
                                ]}
                                onPress={() => updateVisibility(option.id)}
                            >
                                <View style={styles.itemLeft}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.itemTitle}>{option.title}</Text>
                                        <Text style={styles.itemDescription}>{option.description}</Text>
                                    </View>
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
                        Control who sees your contributions{'\n'}to the community.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB',
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
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
        height: 87,
        paddingHorizontal: 20,
        // backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
    },
    firstListItem: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 4,
    },
    itemDescription: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'BrittiRegular',
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
        fontSize: 12,
        fontWeight: 400,
        color: '#393939',
        lineHeight: 18,
    },
});

export default ContributionVisibilitySettingScreen;
