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
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { ActivityIndicator } from 'react-native';

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
    totalAim: number;
    currentProgress: number;
}

export default function BadgesScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fetchedBadges, setFetchedBadges] = useState<Badge[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        loadCachedBadges();
        fetchBadges();
    }, []);

    const loadCachedBadges = async () => {
        try {
            const cachedString = await AsyncStorage.getItem('cached_badges');
            if (cachedString) {
                const cached = JSON.parse(cachedString);

                // Industry standard: Check if cache is within TTL (24 hours)
                const CACHE_TTL = 24 * 60 * 60 * 1000;
                const isStale = !cached.timestamp || (Date.now() - cached.timestamp > CACHE_TTL);

                if (cached.data) {
                    setFetchedBadges(cached.data);
                    // Only stop loading if we have valid data (stale or fresh)
                    setLoading(false);
                }

                if (isStale) {
                    console.log('[CACHE] Badges cache is stale or missing timestamp. Revalidating...');
                    // If it's stale, fetchBadges (already called in useEffect) will handle it
                }
            }
        } catch (e) {
            console.error('Error loading cached badges:', e);
        }
    };

    const fetchBadges = async () => {
        try {
            const response = await api.get('/api/user/account/badges');
            if (response.data) {
                setFetchedBadges(response.data);
                // Store with timestamp for TTL check
                const cacheData = {
                    timestamp: Date.now(),
                    data: response.data
                };
                await AsyncStorage.setItem('cached_badges', JSON.stringify(cacheData));
            }
        } catch (error) {
            console.error("Error fetching badges:", error);
            setError("Failed to sync latest badges. Showing cached data.");
        } finally {
            setLoading(false);
        }
    };

    const calculateProgressWidth = (current: number = 0, total: number = 100): DimensionValue => {
        if (!total || total === 0) return '0%';
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
