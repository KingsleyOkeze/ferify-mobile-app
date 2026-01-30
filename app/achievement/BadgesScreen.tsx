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
    DimensionValue,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

// Badge Images Mapping
const badgeImages: any = {
    starter: {
        earned: require('@/assets/images/badges/fare-starter-badge-earned.png'),
        notEarned: require('@/assets/images/badges/fare-starter-badge-not-earned.png'),
    },
    helper: {
        earned: require('@/assets/images/badges/route-helper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/route-helper-badge-not-earned.png'),
    },
    dropper: {
        earned: require('@/assets/images/badges/fare-dropper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/fare-dropper-badge-not-earned.png'),
    },
    checker: {
        earned: require('@/assets/images/badges/fare-checker-earned.png'),
        notEarned: require('@/assets/images/badges/fare-checker-not-earned.png'),
    },
    report_helper: {
        earned: require('@/assets/images/badges/report-helper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/report-helper-not-earned.png'),
    },
    mapper: {
        earned: require('@/assets/images/badges/route-mapper-badge-earned.png'),
        notEarned: require('@/assets/images/badges/route-mapper-badge-not-earned.png'),
    },
    guardian: {
        earned: require('@/assets/images/badges/route-guardian-badge-earned.png'),
        notEarned: require('@/assets/images/badges/route-guardian-badge-not-earned.png'),
    },
    danfo: {
        earned: require('@/assets/images/badges/danfo-master-badge-earned.png'),
        notEarned: require('@/assets/images/badges/danfo-master-badge-not-earned.png'),
    },
    keke: {
        earned: require('@/assets/images/badges/keke-master-badge-earned.png'),
        notEarned: require('@/assets/images/badges/keke-master-badge-not-earned.png'),
    },
};

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
    currentProgress?: number;
    totalAim?: number;
}

import api from '@/services/api';
import { ActivityIndicator } from 'react-native';

export default function BadgesScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fetchedBadges, setFetchedBadges] = useState<Badge[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    React.useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const response = await api.get('/api/user/account/badges');
            // Merge backend status with frontend metadata (requirements, icons, etc.)
            const mergedBadges = staticBadges.map(sb => {
                const fb = response.data.find((b: any) => b.id === sb.id);
                return {
                    ...sb,
                    earned: fb ? fb.earned : false
                };
            });
            setFetchedBadges(mergedBadges);
        } catch (error) {
            console.error("Error fetching badges:", error);
        } finally {
            setLoading(false);
        }
    };

    const staticBadges: Badge[] = [

        {
            id: 'starter',
            title: 'fare starter',
            earned: true,
            requirements: ['1st fare'], // No specific aim requested for logic, usually 1/1
            description: 'Submit your first fare to unlock this badge.',
            icon: 'flash-outline'
        },
        {
            id: 'helper',
            title: 'route helper',
            earned: true, // Assuming earned for demo, total 5
            requirements: ['5 routes'],
            description: 'Confirm or improve 5 routes to help others get to their destination easily.',
            icon: 'navigate-outline',
            currentProgress: 5,
            totalAim: 5
        },
        {
            id: 'dropper',
            title: 'fare dropper',
            earned: false,
            requirements: ['20 fare drops'],
            description: 'Submit fares, routes, or reports 20 times to unlock this badge.',
            icon: 'pin-outline',
            currentProgress: 12, // Mock progress
            totalAim: 20
        },
        {
            id: 'checker',
            title: 'fare checker',
            earned: false,
            requirements: ['5 checks'],
            description: 'Verify or confirm 5 fares or routes submitted by others to keep Ferify accurate.',
            icon: 'checkmark-circle-outline',
            currentProgress: 2,
            totalAim: 5
        },
        {
            id: 'report_helper',
            title: 'report helper',
            earned: false,
            requirements: ['20 reports'],
            description: 'Report incorrect fares or routes 20 times to help improve transport information.',
            icon: 'megaphone-outline',
            currentProgress: 8,
            totalAim: 20
        },
        {
            id: 'mapper',
            title: 'local mapper',
            earned: false,
            requirements: ['10 locations'],
            description: 'Add or improve 10 routes or stops withing the same areas to unloack this badge.',
            icon: 'map-outline',
            currentProgress: 3,
            totalAim: 10
        },
        {
            id: 'guardian',
            title: 'route guardian',
            earned: false,
            requirements: ['15 verifications'],
            description: 'Consistently update and maintain routes to unlock this badge.',
            icon: 'shield-checkmark-outline',
            currentProgress: 10,
            totalAim: 15
        },
        {
            id: 'danfo',
            title: 'danfo master',
            earned: false,
            requirements: ['15 danfo fares'],
            description: 'Submit more Danfo fares than other contributors to unlock this badge.',
            icon: 'bus-outline',
            currentProgress: 5,
            totalAim: 15
        },
        {
            id: 'keke',
            title: 'keke master',
            earned: false,
            requirements: ['15 keke fares'],
            description: 'Submit more Keke fares than other contributors to unlock this badge.',
            icon: 'bicycle-outline',
            currentProgress: 14,
            totalAim: 15
        },
    ];

    const calculateProgressWidth = (current: number = 0, total: number = 100): DimensionValue => {
        const percentage = Math.min((current / total) * 100, 100);
        return `${percentage}%` as DimensionValue;
    };

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
                {loading ? (
                    <ActivityIndicator size="large" color="#080808" style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.grid}>
                        {fetchedBadges.map((badge) => (
                            <TouchableOpacity
                                key={badge.id}
                                style={styles.badgeCard}
                                onPress={() => setSelectedBadge(badge)}
                            >
                                <Image
                                    source={badge.earned ? badgeImages[badge.id].earned : badgeImages[badge.id].notEarned}
                                    style={styles.badgeImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.badgeTitle}>{badge.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
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

                        {/* Badge Image - Always show earned in Modal */}
                        {selectedBadge && (
                            <Image
                                source={badgeImages[selectedBadge.id].earned}
                                style={styles.modalBadgeImage}
                                resizeMode="contain"
                            />
                        )}

                        {/* Requirements - No Background */}
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

                        {/* Progress Bar (Except for Starter) */}
                        {selectedBadge && selectedBadge.id !== 'starter' && selectedBadge.totalAim && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarBackground}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: calculateProgressWidth(selectedBadge.currentProgress, selectedBadge.totalAim) }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>
                                    {selectedBadge.currentProgress || 0}/{selectedBadge.totalAim}
                                </Text>
                            </View>
                        )}
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
        marginBottom: 20,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#393939',
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        lineHeight: 20,
    },
    scrollContent: {
        paddingHorizontal: 24,
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F3F4',
        borderRadius: 8,
        height: 171
    },
    badgeImage: {
        width: COLUMN_WIDTH - 20,
        height: COLUMN_WIDTH - 20,
        marginBottom: 20,
    },
    badgeTitle: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: '#C2C3C44D',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FBFBFB',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 43,
        alignItems: 'center',
        width: '100%',
        height: 383,
    },
    cancelButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 8,
    },
    modalBadgeImage: {
        width: 86.6,
        height: 100,
        marginTop: 20,
        marginBottom: 14,
    },
    requirementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    requirementTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        marginHorizontal: 4,
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },
    modalDescription: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        maxWidth: '80%',
    },
    progressContainer: {
        width: '100%',
        height: 10,
        alignItems: 'center',
        marginBottom: 32,
    },
    progressBarBackground: {
        width: '80%',
        height: 8,
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#080808', // Black progress bar
        borderRadius: 100,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
    },

});
