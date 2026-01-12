import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

function ContributionVisibilitySettingScreen() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('everyone');

    const visibilityOptions = [
        {
            id: 'everyone',
            title: 'Everyone',
            description: 'Visible to all commuters',
            icon: 'globe-outline',
        },
        {
            id: 'community',
            title: 'Community',
            description: 'Visible to verified users',
            icon: 'people-outline',
        },
        {
            id: 'private',
            title: 'Private',
            description: 'Only visible to you',
            icon: 'lock-closed-outline',
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
                                onPress={() => setSelectedOption(option.id)}
                            >
                                <View style={styles.itemLeft}>
                                    <Ionicons name={option.icon as any} size={24} color="#333" style={styles.itemIcon} />
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
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 4,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28, // Matches other screens
        fontWeight: 'bold',
        color: '#000',
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

export default ContributionVisibilitySettingScreen;
