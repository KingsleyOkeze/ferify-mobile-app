import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '@/services/api';
import { cacheHelper } from '@/utils/cache';
import { STORAGE_KEYS, CACHE_TTL } from '@/constants/storage';
import busImage from '@/assets/images/transportation-icons/busImage.png';
import kekeImage from '@/assets/images/transportation-icons/kekeImage.png';
import okadaImage from '@/assets/images/transportation-icons/okadaImage.png';

// Enable LayoutAnimation for Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const noContributionImage = require('../../assets/images/no-data-images/no_data_found_image.png');

type TabType = 'fares' | 'routes' | 'reports';

function AllContributionsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('fares');
    const [isLoading, setIsLoading] = useState(false);
    const [historyData, setHistoryData] = useState<any[]>([]);

    // Initial load from cache
    useEffect(() => {
        loadCachedHistory();
    }, [activeTab]);

    const loadCachedHistory = async () => {
        try {
            const cacheKey = `${STORAGE_KEYS.CONTRIBUTION_HISTORY}_${activeTab}`;
            const cachedData = await cacheHelper.get<any[]>(cacheKey, CACHE_TTL.LONG);
            if (cachedData) {
                setHistoryData(cachedData);
            }
        } catch (e) {
            console.error('Error loading cached history:', e);
        }
    };

    const tabs: { id: TabType; label: string }[] = [
        { id: 'fares', label: 'Fares' },
        { id: 'routes', label: 'Routes' },
        { id: 'reports', label: 'Reports' },
    ];

    const handleTabPress = (tabId: TabType) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveTab(tabId);
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            // Map frontend tab to backend type
            const typeMap: { [key in TabType]: string } = {
                fares: 'fare_submission',
                routes: 'route_confirmation',
                reports: 'incorrect_report'
            };

            const response = await api.get('/api/user/contribution/history', {
                params: { type: typeMap[activeTab] }
            });

            if (response.data && response.data.history) {
                const rawHistory = response.data.history;

                // Group by date
                const grouped: { [key: string]: any[] } = {};
                rawHistory.forEach((item: any) => {
                    const date = new Date(item.timestamp || item.createdAt || Date.now());
                    const dateGroup = date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });

                    if (!grouped[dateGroup]) {
                        grouped[dateGroup] = [];
                    }

                    // Map transport type to image and format other fields
                    let imageSource = busImage;
                    const transport = item.details?.vehicleType || item.vehicleType || 'bus';
                    if (transport === 'keke') imageSource = kekeImage;
                    if (transport === 'bike' || transport === 'okada') imageSource = okadaImage;

                    grouped[dateGroup].push({
                        id: item._id,
                        from: item.details?.from || item.origin?.raw?.split(',')[0] || 'Unknown',
                        to: item.details?.to || item.destination?.raw?.split(',')[0] || 'Unknown',
                        price: item.details?.fareAmount ? `₦${item.details.fareAmount}` : (item.fareAmount ? `₦${item.fareAmount}` : ''),
                        time: item.details?.timeOfDay || item.timeOfDay || 'Unknown',
                        transport: transport,
                        image: imageSource,
                        points: `+${item.pointsAwarded || 50} pts`,
                        issue: item.type === 'incorrect_report' ? (item.details?.issue || 'Incorrect Report') : undefined
                    });
                });

                const mappedHistory = Object.keys(grouped).map(dateGroup => ({
                    dateGroup,
                    items: grouped[dateGroup]
                }));

                setHistoryData(mappedHistory);
                // Cache data
                const cacheKey = `${STORAGE_KEYS.CONTRIBUTION_HISTORY}_${activeTab}`;
                await cacheHelper.set(cacheKey, mappedHistory);
            } else {
                setHistoryData([]);
            }

        } catch (error) {
            console.error('Error fetching contribution history:', error);
            // Fallback to empty or handled error state
            setHistoryData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [activeTab])
    );

    const getTitle = () => {
        if (activeTab === 'fares') {
            return 'Fares';
        } else if (activeTab === 'routes') {
            return 'Routes';
        } else if (activeTab === 'reports') {
            return 'Reports';
        }
        return 'Fares';
    };

    const renderCardContent = (item: any) => {
        if (activeTab === 'fares') {
            return (
                <View style={styles.cardContent}>
                    <Text style={styles.cardMainText}>{item.from} - {item.to}</Text>
                    <Text style={styles.cardSubText}>{item.price}</Text>
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        } else if (activeTab === 'routes') {
            return (
                <View style={styles.cardContent}>
                    <Text style={styles.cardMainText}>{item.from} - {item.to}</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        } else {
            // Reports
            return (
                <View style={styles.cardContent}>
                    <Text style={[styles.cardMainText, styles.reportIssueText]}>{item.issue}</Text>
                    <Text style={styles.cardSubText}>{item.from} - {item.to}</Text>
                    <Text style={styles.cardTimeText}>{item.time}</Text>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{getTitle()}</Text>
                <TouchableOpacity onPress={() => router.dismiss()} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => handleTabPress(tab.id)}
                    >
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.id && styles.activeTabLabel
                        ]}>
                            {tab.label}
                        </Text>
                        {activeTab === tab.id && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content List */}
            {isLoading && historyData.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#080808" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        (!isLoading && historyData.length === 0) && { flexGrow: 1 }
                    ]}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={fetchHistory} />
                    }
                >
                    {historyData.map((group, groupIndex) => (
                        <View key={groupIndex} style={styles.groupContainer}>
                            <Text style={styles.dateHeader}>{group.dateGroup}</Text>

                            {group.items.map((item: any, index: number) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.card,
                                        index === 0 && styles.firstCard
                                    ]}
                                >
                                    {/* Left Icon/Image */}
                                    <View style={styles.iconContainer}>
                                        <Image
                                            source={item.image}
                                            style={styles.transportIcon}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* Middle Content */}
                                    {renderCardContent(item)}

                                    {/* Right Points */}
                                    <View style={styles.pointsContainer}>
                                        <Text style={styles.pointsText}>{item.points}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}

                    {(!isLoading && historyData.length === 0) && (
                        <View style={styles.emptyStateContainer}>
                            <Image source={noContributionImage} style={styles.noDataImage} resizeMode="contain" />
                            <Text style={styles.noDataTitle}>No {activeTab} yet</Text>
                            <Text style={styles.noDataSubtitle}>
                                When you submit {activeTab === 'fares' ? 'fare updates' : activeTab === 'routes' ? 'new routes' : 'reports'}, they will appear here.
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyStateButton}
                                onPress={() => router.push('../fare-contribution/FareContributionScreen')}
                            >
                                <Text style={styles.emptyStateButtonText}>
                                    {activeTab === 'reports' ? 'Report an Issue' : 'Share Fare'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFBFB",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 32,
    },
    headerButton: {
        // padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        lineHeight: 19.2,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        paddingHorizontal: 16,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 12,
    },
    tabLabel: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        fontWeight: 600,
        lineHeight: 24
    },
    activeTabLabel: {
        color: '#080808',
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        fontSize: 16
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '85%',
        height: 3,
        backgroundColor: '#080808',
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 32,
    },
    groupContainer: {
        marginBottom: 32,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginLeft: 20,
        // marginTop: 5,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 112,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        backgroundColor: '#FFFFFF',
    },
    firstCard: {
        borderTopWidth: 1,
        borderTopColor: '#DADADA',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 4,
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transportIcon: {
        width: 44,
        height: 44,
    },
    cardContent: {
        flex: 1,
        height: '100%',
    },
    cardMainText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#393939',
        // marginBottom: 2,
        lineHeight: 24,
    },
    reportIssueText: {
        color: '#080808',
        fontFamily: 'BrittiSemibold',
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 24,
    },
    cardSubText: {
        fontSize: 14,
        fontWeight: 600,
        color: '#080808',
        // marginTop: 10,
        // marginBottom: 2,
        lineHeight: 24
    },
    cardTimeText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        lineHeight: 24,
    },
    spacer: {
        height: 4,
    },
    pointsContainer: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        height: '100%',

    },
    pointsText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#1B9E4B',
    },
    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    noDataImage: {
        width: 95.6,
        height: 97.36,
        marginBottom: 32,
    },
    noDataTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 19.2
    },
    noDataSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        width: '90%'
    },
    emptyStateButton: {
        backgroundColor: '#080808',
        borderRadius: 100,
        width: 148,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyStateButtonText: {
        color: '#FBFBFB',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
    },
});

export default AllContributionsScreen;
