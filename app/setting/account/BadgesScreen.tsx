import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Modal,
    Pressable,
    Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GRID_PADDING = 24;
const COLUMN_GAP = 12;
const COLUMN_WIDTH = (width - (GRID_PADDING * 2) - (COLUMN_GAP * 2)) / 3;

interface Badge {
    id: string;
    title: string;
    earned: boolean;
    requirements: string[];
    description: string;
    icon: string;
}

export default function BadgesScreen() {
    const router = useRouter();
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const badges: Badge[] = [
        {
            id: 'starter',
            title: 'fare starter',
            earned: true,
            requirements: ['1st fare'],
            description: 'You\'ve shared your first fare report! Keep going to help more people.',
            icon: 'flash-outline'
        },
        {
            id: 'helper',
            title: 'route helper',
            earned: true,
            requirements: ['5 routes'],
            description: 'You\'ve mapped 5 routes! Your local knowledge is making a difference.',
            icon: 'navigate-outline'
        },
        {
            id: 'dropper',
            title: 'fare dropper',
            earned: false,
            requirements: ['10 fare drops'],
            description: 'Report 10 fare drops to earn this badge. Help users catch the best deals.',
            icon: 'pin-outline'
        },
        {
            id: 'checker',
            title: 'fare checker',
            earned: false,
            requirements: ['20 checks'],
            description: 'Verify 20 fares reported by others to ensure accuracy across the platform.',
            icon: 'checkmark-circle-outline'
        },
        {
            id: 'report_helper',
            title: 'report helper',
            earned: false,
            requirements: ['10 reports'],
            description: 'Submit 10 helpful reports about traffic or route changes.',
            icon: 'megaphone-outline'
        },
        {
            id: 'mapper',
            title: 'local mapper',
            earned: false,
            requirements: ['15 locations'],
            description: 'Add or update 15 local landmarks or bus stops.',
            icon: 'map-outline'
        },
        {
            id: 'guardian',
            title: 'route guardian',
            earned: false,
            requirements: ['50 verifications'],
            description: 'The ultimate badge for accuracy. Verify 50 critical route updates.',
            icon: 'shield-checkmark-outline'
        },
        {
            id: 'danfo',
            title: 'danfo master',
            earned: false,
            requirements: ['30 danfo fares'],
            description: 'Report 30 danfo fares specifically. You know the street prices!',
            icon: 'bus-outline'
        },
        {
            id: 'keke',
            title: 'keke master',
            earned: false,
            requirements: ['30 keke fares'],
            description: 'Master of the 3-wheelers. Report 30 keke fares accurately.',
            icon: 'bicycle-outline'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#080808" />
                </TouchableOpacity>
                <Text style={styles.title}>Badges</Text>
                <Text style={styles.subtitle}>Collect them all by contributing to the community.</Text>
            </View>

            {/* Badges Grid */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    {badges.map((badge) => (
                        <TouchableOpacity
                            key={badge.id}
                            style={styles.badgeCard}
                            onPress={() => setSelectedBadge(badge)}
                        >
                            <View style={[styles.badgeIconContainer, !badge.earned && styles.unearnedBadge]}>
                                <Ionicons
                                    name={badge.icon as any}
                                    size={36}
                                    color={badge.earned ? "#080808" : "#AAA"}
                                />
                            </View>
                            <Text style={styles.badgeTitle}>{badge.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Badge Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedBadge}
                onRequestClose={() => setSelectedBadge(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSelectedBadge(null)}
                >
                    <Pressable style={styles.modalContent}>
                        {/* Cancel Icon */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setSelectedBadge(null)}
                        >
                            <Ionicons name="close" size={24} color="#080808" />
                        </TouchableOpacity>

                        {/* Badge Image */}
                        <View style={[styles.modalIconContainer, !selectedBadge?.earned && styles.unearnedBadge]}>
                            <Ionicons
                                name={selectedBadge?.icon as any}
                                size={80}
                                color={selectedBadge?.earned ? "#080808" : "#AAA"}
                            />
                        </View>

                        {/* Badge Title */}
                        <Text style={styles.modalBadgeTitle}>{selectedBadge?.title}</Text>

                        {/* Requirements */}
                        <View style={styles.requirementsContainer}>
                            {selectedBadge?.requirements.map((req, index) => (
                                <View key={index} style={styles.requirementTag}>
                                    <Text style={styles.requirementText}>{req}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Description */}
                        <Text style={styles.modalDescription}>
                            {selectedBadge?.description}
                        </Text>

                        {/* Okay Button */}
                        <TouchableOpacity
                            style={styles.okayButton}
                            onPress={() => setSelectedBadge(null)}
                        >
                            <Text style={styles.okayButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginBottom: 16,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#080808',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: COLUMN_GAP,
    },
    badgeCard: {
        width: COLUMN_WIDTH,
        marginBottom: 24,
        alignItems: 'center',
    },
    badgeIconContainer: {
        width: COLUMN_WIDTH - 10,
        height: COLUMN_WIDTH - 10,
        borderRadius: (COLUMN_WIDTH - 10) / 2,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    unearnedBadge: {
        backgroundColor: '#F2F2F2',
        opacity: 0.5,
    },
    badgeTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#080808',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 32,
        alignItems: 'center',
    },
    cancelButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 8,
    },
    modalIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#EEEEEE',
    },
    modalBadgeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#080808',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    requirementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    requirementTag: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        marginHorizontal: 4,
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#080808',
    },
    modalDescription: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    okayButton: {
        backgroundColor: '#080808',
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    okayButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
