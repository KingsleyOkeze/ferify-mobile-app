import React, { useState, useCallback } from 'react';
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
            // Fetch data based on activeTab
            // Endpoint: /api/user/contribution/history?type=fares
            const response = await api.get('/api/user/contribution/history', {
                params: { type: activeTab }
            });

            if (response.data && response.data.history) {
                // Map the response to ensure icons are handled correctly
                const mappedHistory = response.data.history.map((group: any) => ({
                    ...group,
                    items: group.items.map((item: any) => {
                        let imageSource = busImage;
                        if (item.transport === 'keke') imageSource = kekeImage;
                        if (item.transport === 'okada') imageSource = okadaImage;

                        // Retain existing image logic
                        return { ...item, image: imageSource };
                    })
                }));
                setHistoryData(mappedHistory);
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#080808',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        paddingHorizontal: 20,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
    },
    tabLabel: {
        fontSize: 16,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        fontWeight: 400,
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
        width: '60%',
        height: 3,
        backgroundColor: '#080808',
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    groupContainer: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
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
        borderRadius: 20,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transportIcon: {
        width: 44,
        height: 44,
    },
    cardContent: {
        flex: 1,
        height: '100%'
    },
    cardMainText: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#000',
        marginBottom: 2,
    },
    reportIssueText: {
        color: '#080808',
        fontFamily: 'BrittiSemibold',
        fontWeight: 600,
        fontSize: 14
    },
    cardSubText: {
        fontSize: 14,
        fontWeight: 400,
        color: '#080808',
        marginTop: 10,
        marginBottom: 2,
    },
    cardTimeText: {
        fontSize: 12,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
    },
    spacer: {
        height: 4,
    },
    pointsContainer: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        height: '100%'

    },
    pointsText: {
        fontSize: 12,
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
        marginBottom: 24,
    },
    noDataTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
        color: '#080808',
        textAlign: 'center',
        marginBottom: 12,
    },
    noDataSubtitle: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'BrittiRegular',
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
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
        fontWeight: 600,
        fontFamily: 'BrittiSemibold',
    },
});

export default AllContributionsScreen;
